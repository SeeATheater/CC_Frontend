import styled from 'styled-components';
import KaKaoLogo from '@/assets/icons/KakaoRound.svg?react';

function KakaoLoginButton() {
	const client_id = import.meta.env.VITE_KAKAO_CLIENT_ID;
	const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
	const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
	kakaoAuthUrl.searchParams.set('client_id', client_id);
	kakaoAuthUrl.searchParams.set('redirect_uri', redirect_uri);
	kakaoAuthUrl.searchParams.set('response_type', 'code');
	const KAKAO_AUTH_URL = kakaoAuthUrl.toString();

	const handleKakaoLogin = () => {
		window.location.href = KAKAO_AUTH_URL;
	};

	return (
		<Button onClick={handleKakaoLogin}>
			<KaKaoLogo />
			카카오 로그인
		</Button>
	);
}

export default KakaoLoginButton;

const Button = styled.button`
	padding: 10px 100px;

	display: flex;
	gap: 8px;
	justify-content: center;
	align-items: center;
	background: #fddc3f;
	border-radius: 5px;

	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.regular};

	@media (min-width: 768px) {
		width: 420px;
		height: 48px;

		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	}
`;
