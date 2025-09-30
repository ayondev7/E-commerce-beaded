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
	categoryName?: string;
	isInCart?: boolean;
	isInWishlist?: boolean;
	createdAt: string;
	updatedAt: string;
	name?: string;
	description?: string;
};

export type ProductResponse = {
	product: Product;
};

export type ProductListResponse = {
	products: Product[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type CreateProductInput = FormData | Record<string, any>;