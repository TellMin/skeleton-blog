import { client } from './microCMSClient';

export const getBlog = async (id: string) => {
	const res = await client.get<Blogs>({
		endpoint: 'blog',
		queries: {
			limit: 10,
			ids: id
		}
	});
	return res.contents[0];
};

export const getBlogs = async () => {
	const res = await client.get<Blogs>({
		endpoint: 'blog',
		queries: {
			limit: 10,
			fields: 'id,title,createdAt,updatedAt'
		}
	});
	return res.contents;
};
