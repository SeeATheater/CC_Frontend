import axios from 'axios';

const AUTH_LOGOUT_EVENT = 'auth:logout';

const decodeJwtPayload = (token) => {
	const payload = token.split('.')[1];
	if (!payload) return null;

	const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
	const decoded = decodeURIComponent(
		atob(normalized)
			.split('')
			.map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
			.join(''),
	);

	return JSON.parse(decoded);
};

const isAccessTokenValid = (token) => {
	if (!token) return false;

	try {
		const payload = decodeJwtPayload(token);
		if (!payload?.exp) return false;

		return payload.exp * 1000 > Date.now();
	} catch {
		return false;
	}
};

const clearStoredAuth = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	sessionStorage.removeItem('selectedRole');
	window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export {
	AUTH_LOGOUT_EVENT,
	axiosInstance,
	clearStoredAuth,
	isAccessTokenValid,
};
