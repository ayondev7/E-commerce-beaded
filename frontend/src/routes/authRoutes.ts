import API_URL from ".";

const BASE = `${API_URL}/auth`;

export const AUTH_ROUTES = {
	credential: {
		signup: `${BASE}/credential/signup`,
		signin: `${BASE}/credential/signin`,
	},
	google: {
		signin: `${BASE}/google/signin`,
	},
	verify: `${BASE}/verify`,
	me: `${BASE}/me`,
	protected: `${BASE}/protected`,
} as const;

export default AUTH_ROUTES;
