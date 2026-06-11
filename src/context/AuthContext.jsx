import { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/apis/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
	AUTH_LOGOUT_EVENT,
	clearStoredAuth,
	isAccessTokenValid,
} from '@/utils/apis/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');

		if (isAccessTokenValid(accessToken) && refreshToken) {
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);
			setIsLoggedIn(true);
			axiosInstance.defaults.headers.common['Authorization'] =
				`Bearer ${accessToken}`;
		} else {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('selectedRole');
			setIsLoggedIn(false);
			setAccessToken(null);
			setRefreshToken(null);
			delete axiosInstance.defaults.headers.common['Authorization'];
		}
	}, []);

	useEffect(() => {
		const resetAuthState = () => {
			setAccessToken(null);
			setRefreshToken(null);
			setIsLoggedIn(false);
			delete axiosInstance.defaults.headers.common.Authorization;
		};

		window.addEventListener(AUTH_LOGOUT_EVENT, resetAuthState);
		return () => window.removeEventListener(AUTH_LOGOUT_EVENT, resetAuthState);
	}, []);

	const setAuthInfo = (accessToken, refreshToken, path) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		setAccessToken(accessToken);
		setRefreshToken(refreshToken);
		setIsLoggedIn(true);
		axiosInstance.defaults.headers.common['Authorization'] =
			`Bearer ${accessToken}`;

		navigate(path);
	};

	const logout = (path) => {
		clearStoredAuth();
		setAccessToken(null);
		setRefreshToken(null);
		setIsLoggedIn(false);
		delete axiosInstance.defaults.headers.common['Authorization'];

		navigate(path);
	};

	const value = {
		isLoggedIn,
		accessToken,
		refreshToken,
		setAuthInfo,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth는 AuthProvider 안에서 사용되어야 합니다.');
	}
	return context;
};
