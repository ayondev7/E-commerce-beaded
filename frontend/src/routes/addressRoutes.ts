import API_URL from ".";

const BASE = `${API_URL}/addresses`;

export const ADDRESS_ROUTES = {
  list: `${BASE}/get-user-addresses`,
  create: `${BASE}/add-new-address`,
  update: (id: string | number) => `${BASE}/update-address/${id}`,
  setDefault: (id: string | number) => `${BASE}/set-default-address/${id}`,
  removeDefault: (id: string | number) => `${BASE}/remove-default-address/${id}`,
  delete: (id: string | number) => `${BASE}/delete-address/${id}`,
} as const;

export default ADDRESS_ROUTES;