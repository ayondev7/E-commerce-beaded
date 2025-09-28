import API_URL from ".";

export const PRODUCT_ROUTES = {
	list: `${API_URL}/products`,
	detail: (id: string | number) => `${API_URL}/products/${id}`,
	create: `${API_URL}/products`,
	update: (id: string | number) => `${API_URL}/products/${id}`,
	delete: (id: string | number) => `${API_URL}/products/${id}`,
} as const;

export default PRODUCT_ROUTES;
