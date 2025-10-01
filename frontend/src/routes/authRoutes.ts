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
	guest: {
		signin: `${BASE}/guest/signin`,
	},
	verify: `${BASE}/verify`,
	me: `${BASE}/get-my-info`,
	updateMe: `${BASE}/update-my-info`,
	protected: `${BASE}/protected`,
} as const;

export default AUTH_ROUTES;
