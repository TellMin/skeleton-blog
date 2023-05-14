import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import { openAIClient } from './clinet';

export const chat = async (messages: Array<ChatCompletionRequestMessage> | undefined) => {
	// If we don't have any messages, return early
	if (!messages) return;

	// Create a request to OpenAI's chat completion API
	const chatCompletionRequest: CreateChatCompletionRequest = {
		model: 'gpt-3.5-turbo',
		messages
	};

	// Send the request to OpenAI's chat completion API
	const chatCompletion = await openAIClient.createChatCompletion(chatCompletionRequest);

	// Return the first response from OpenAI
	return chatCompletion.data.choices[0].message?.content;
};
