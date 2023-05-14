import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const inputMessage = (await request.formData()).get('input');
		const messages = {
			reply: inputMessage
		};
		return messages;
	}
} satisfies Actions;
