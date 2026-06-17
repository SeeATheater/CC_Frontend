import styled from 'styled-components';
import KakaoLoginButton from '@/components/Login/KakaoLoginButton';
import GeneralLoginButton from '@/components/Login/GeneralLoginButton';
import LogoWeb from '@/assets/icons/login/LogoWeb.svg?react';
import LogoMobile from '@/assets/icons/login/LogoMobile.svg?react';
import chevron from '@/assets/icons/chevronLeft.svg?react';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

function Login() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { isLoggedIn } = useAuth();

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/', { replace: true });
			return;
		}

		const role = searchParams.get('role');
		if (role) {
			sessionStorage.setItem('selectedRole', role);
		}
	}, [isLoggedIn, navigate, searchParams]);

	return (
		<Container>
			<Chevron onClick={() => navigate(-1)} />
			{isMobile ? <LogoMobile /> : <LogoWeb />}
			<ButtonGroup>
				<KakaoLoginButton />
				<GeneralLoginButton />
			</ButtonGroup>
		</Container>
	);
}

export default Login;

const Container = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	gap: 240px;
	justify-content: center;
	align-items: center;

	@media (min-width: 768px) {
		gap: 144px;
	}

	position: relative;
`;

const Chevron = styled(chevron)`
	position: absolute;
	top: 20px;
	left: 28px;
`;

const ButtonGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
`;
