import API_URL from ".";

const BASE = `${API_URL}/carts`;

export const CART_ROUTES = {
  list: `${BASE}/get-user-cart`,
  addToCart: `${BASE}/add-to-cart`,
  update: (id: string | number) => `${BASE}/update-cart-item/${id}`,
  remove: (id: string | number) => `${BASE}/remove-from-cart/${id}`,
  clear: `${BASE}/clear-cart`,
} as const;

export default CART_ROUTES;