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

	const stream = parseCreateChatCompletionResponseToIncomingMessage(response.data);
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

const isIncomingMessage = (obj: unknown): obj is IncomingMessage => {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const maybeIncomingMessage = obj as IncomingMessage;

	return(
		typeof maybeIncomingMessage.statusCode === 'number' &&
		maybeIncomingMessage.statusCode === 200 &&
		typeof maybeIncomingMessage.headers === 'object' &&
		maybeIncomingMessage.headers['content-type'] === 'text/event-stream' &&
		typeof maybeIncomingMessage[Symbol.asyncIterator] === 'function'
	);
}

const parseCreateChatCompletionResponseToIncomingMessage = (response: unknown): IncomingMessage => {
	if (!isIncomingMessage(response)) {
		throw new Error('response is not IncomingMessage');
	}
	return response;
}