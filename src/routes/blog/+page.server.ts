import { getBlogs } from '$lib/server/microCMS/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const blogs = await getBlogs();
	return {
		body: {
			blogs
		}
	};
};
