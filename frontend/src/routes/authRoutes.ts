import API_URL from ".";

export const AUTH_ROUTES = {
	credential: {
		signup: `${API_URL}/auth/credential/signup`,
		signin: `${API_URL}/auth/credential/signin`,
	},
	google: {
		signin: `${API_URL}/auth/google/signin`,
	},
	me: `${API_URL}/auth/me`,
	protected: `${API_URL}/auth/protected`,
} as const;

export default AUTH_ROUTES;
