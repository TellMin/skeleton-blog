type Blogs = {
	contents: Blog[];
	totalCount: number;
	offset: number;
	limit: number;
};

type Blog = {
	id: string;
	title: string;
	body: string;
	createdAt: string;
	updatedAt: string;
};
