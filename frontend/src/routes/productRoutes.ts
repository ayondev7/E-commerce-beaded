import API_URL from ".";

const BASE = `${API_URL}/products`;

export const PRODUCT_ROUTES = {
	list: `${BASE}/get-list`,
	detail: (id: string | number) => `${BASE}/get-product/${id}`,
	bestSellers: `${BASE}/get-best-seller-products`,
	latestCollection: `${BASE}/get-latest-collection-produts`,
	create: `${BASE}/add-new-product`,
	update: (id: string | number) => `${BASE}/patch-product/${id}`,
	delete: (id: string | number) => `${BASE}/delete-product/${id}`,
} as const;

export default PRODUCT_ROUTES;
