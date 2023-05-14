import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		body: {
			item: 'chat'
		}
	};
}) satisfies PageServerLoad;
