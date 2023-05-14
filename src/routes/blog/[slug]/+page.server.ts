import { getBlog } from '$lib/server/microCMS/queries';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => await getBlog(params.slug)) satisfies PageServerLoad;
