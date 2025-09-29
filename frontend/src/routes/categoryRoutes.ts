import API_URL from ".";

const BASE = `${API_URL}/categories`;

export const CATEGORY_ROUTES = {
  list: `${BASE}/get-all-categories`,
  detail: (id: string | number) => `${BASE}/get-category/${id}`,
  create: `${BASE}/add-new-category`,
  update: (id: string | number) => `${BASE}/patch-category/${id}`,
  delete: (id: string | number) => `${BASE}/delete-category/${id}`,
} as const;

export default CATEGORY_ROUTES;
