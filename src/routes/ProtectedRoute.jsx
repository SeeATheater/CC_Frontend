import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PAYMENT_RESULT_STATUSES = ['success', 'fail', 'cancel'];

const ProtectedRoute = () => {
	const { isLoggedIn } = useAuth();
	const location = useLocation();
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	const paymentStatus = new URLSearchParams(location.search).get('payment');
	const isPaymentResultRoute =
		location.pathname.startsWith('/ticketing/') &&
		PAYMENT_RESULT_STATUSES.includes(paymentStatus);

	if (isPaymentResultRoute) {
		return <Outlet />;
	}

	if (!isLoggedIn && (!accessToken || !refreshToken)) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
