import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EyeRollingSVG from '@/components/EyeRollingSVG';
import { axiosInstance } from '@/utils/apis/axiosInstance';
import { useAuth } from '@/context/AuthContext';

function KakaoCallback() {
	const location = useLocation();
	const navigate = useNavigate();

	const { setAuthInfo } = useAuth();

	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) {
			return;
		}
		initialized.current = true;

		const getCode = async () => {
			const params = new URLSearchParams(location.search);
			const code = params.get('code');
			const role = sessionStorage.getItem('selectedRole');
			const fromPath = location.state?.from?.pathname || '/home';

			if (!code) {
				console.error('카카오 인가 코드를 받지 못했습니다.');
				alert('카카오 로그인에 실패했습니다.');
				navigate('/');
				return;
			}

			if (!role) {
				console.error('역할 정보(role)가 없습니다. 다시 로그인해 주세요.');
				alert('역할 정보를 가져올 수 없습니다. 다시 로그인해 주세요.');
				navigate('/');
				return;
			}
			try {
				const response = await axiosInstance.post(
					`${import.meta.env.VITE_APP_API_URL}/auth/kakao/callback`,
					{ code, role, redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI },
				);
				const { accessToken, refreshToken } = response.data;
				setAuthInfo(accessToken, refreshToken, fromPath);
			} catch (error) {
				console.error('로그인 처리 중 오류 발생:', error);
				alert('로그인 중 오류가 발생했습니다.');
				navigate('/');
			}
		};

		getCode();
	}, [location, navigate]);

	return (
		<div>
			<EyeRollingSVG isLoading={true} />
			<p>카카오 로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
		</div>
	);
}

export default KakaoCallback;
