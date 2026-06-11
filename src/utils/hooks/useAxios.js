import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
	axiosInstance,
	clearStoredAuth,
} from '@/utils/apis/axiosInstance';

let refreshPromise = null;

const refreshAccessToken = () => {
	if (!refreshPromise) {
		const refreshToken = localStorage.getItem('refreshToken');

		if (!refreshToken) {
			return Promise.reject(new Error('Refresh token is missing.'));
		}

		refreshPromise = axios
			.post(
				`${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
				{ refreshToken },
				{ withCredentials: true },
			)
			.then((response) => {
				const newAccessToken =
					response.data?.accessToken ?? response.data?.result?.accessToken;

				if (!newAccessToken) {
					throw new Error('Refresh response did not include an access token.');
				}

				localStorage.setItem('accessToken', newAccessToken);
				axiosInstance.defaults.headers.common.Authorization =
					`Bearer ${newAccessToken}`;
				return newAccessToken;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
};

const useAxios = () => {
	const navigate = useNavigate();

	const requestInterceptor = useCallback((config) => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	}, []);

	const responseInterceptor = useCallback(
		async (error) => {
			const originalRequest = error.config;

			if (
				error.response?.status === 401 &&
				originalRequest &&
				!originalRequest._retry
			) {
				originalRequest._retry = true;

				try {
					const newAccessToken = await refreshAccessToken();
					originalRequest.headers = originalRequest.headers ?? {};
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					clearStoredAuth();
					navigate('/login', { replace: true });
					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(error);
		},
		[navigate],
	);

	useEffect(() => {
		const req = axiosInstance.interceptors.request.use(requestInterceptor);
		const res = axiosInstance.interceptors.response.use(
			(response) => response,
			responseInterceptor,
		);

		return () => {
			axiosInstance.interceptors.request.eject(req);
			axiosInstance.interceptors.response.eject(res);
		};
	}, [requestInterceptor, responseInterceptor]);

	return axiosInstance;
};

export default useAxios;
