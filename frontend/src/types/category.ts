export type Category = {
	id: string | number;
	name: string;
	description?: string;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type CategoryListResponse = {
	categories: Category[];
};

export type CategoryPayload = FormData | Record<string, unknown>;