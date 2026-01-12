import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		alert('관리자 로그인이 필요합니다.');
		return <Navigate to="/admin/login" replace />;
	}

	return <Outlet />;
};

export default AdminProtectedRoute;
