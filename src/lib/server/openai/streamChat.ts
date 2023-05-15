import type { IncomingMessage } from 'http';
import { openAIClient } from './clinet';
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';

export async function* streamChat(message: string) {
	const messages: ChatCompletionRequestMessage[] = [
		{
			role: 'system',
			content: 'You are friendly, helpful and very kind assistant ai.'
		},
		{
			role: 'assistant',
			content: 'How can I hepl you?'
		},
		{
			role: 'user',
			content: message
		}
	];

	const chatCompletionRequest: CreateChatCompletionRequest = {
		model: 'gpt-3.5-turbo',
		messages,
		stream: true
	};

	const response = await openAIClient.createChatCompletion(chatCompletionRequest, {
		responseType: 'stream'
	});

	const stream = response.data as unknown as IncomingMessage;
	for await (const chunk of stream) {
		const lines: string[] = chunk
			.toString('utf8')
			.split('\n')
			.filter((line: string) => line.trim().startsWith('data: '));

		for (const line of lines) {
			const message = line.replace(/^data: /, '');
			if (message === '[DONE]') {
				return;
			}

			const json = JSON.parse(message);
			const token: string | undefined = json.choices[0].delta.content;
			if (token) {
				yield token;
			}
		}
	}
}
