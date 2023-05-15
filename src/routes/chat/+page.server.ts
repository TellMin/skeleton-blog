import type { Actions } from './$types';
import type { ChatCompletionRequestMessage } from 'openai';
import { chat } from '$lib/server/openai/chat';

export const actions = {
	default: async ({ request }) => {
		const inputMessage = (await request.formData()).get('input');
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
				content: inputMessage?.toString() ?? ''
			}
		];

		const reply = (await chat(messages)) ?? '';

		return {
			reply
		};
	}
} satisfies Actions;
