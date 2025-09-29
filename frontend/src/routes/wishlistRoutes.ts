import API_URL from ".";

const BASE = `${API_URL}/wishlists`;

export const WISHLIST_ROUTES = {
  list: `${BASE}/get-user-wishlist`,
  addToWishlist: `${BASE}/add-to-wishlist`,
  remove: (id: string | number) => `${BASE}/remove-from-wishlist/${id}`,
  clear: `${BASE}/clear-wishlist`,
} as const;

export default WISHLIST_ROUTES;
