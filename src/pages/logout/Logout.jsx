import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

function Logout() {
	const { logout } = useAuth();
	const { fetchData } = useCustomFetch();
	const requested = useRef(false);

	useEffect(() => {
		if (requested.current) return;
		requested.current = true;

		const requestLogout = async () => {
			try {
				await fetchData('/auth/logout', 'POST', {});
			} finally {
				logout('/login');
			}
		};

		requestLogout();
	}, [fetchData, logout]);

	return null;
}

export default Logout;
