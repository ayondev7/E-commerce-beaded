export type Product = {
	id: string;
	categoryId: string;
	productCollection: string;
	productName: string;
	productDescription: string;
	productSlug: string;
	price: number;
	offerPrice?: number;
	images: string[];
	category?: {
		id: string;
		name: string;
		image: string;
	};
	createdAt: string;
	updatedAt: string;
	name?: string;
	description?: string;
};

export type ProductListResponse = {
	items: Product[];
	total?: number;
	page?: number;
	pageSize?: number;
} | Product[];

export type CreateProductInput = FormData | Record<string, any>;