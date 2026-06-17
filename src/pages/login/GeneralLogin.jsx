import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWeb from '@/assets/icons/login/LogoWeb.svg?react';
import LogoMobile from '@/assets/icons/login/LogoMobile.svg?react';
import chevron from '@/assets/icons/chevronLeft.svg?react';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { useAuth } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/apis/axiosInstance';

// [임시] 앱 심사용 일반 로그인. 심사 통과 후 revert 대상.
function GeneralLogin() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { setAuthInfo } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		if (!email || !password) {
			alert('이메일과 비밀번호를 입력해 주세요.');
			return;
		}
		try {
			const response = await axiosInstance.post('/auth/review/login', {
				email,
				password,
			});
			const { accessToken, refreshToken } = response.data;
			setAuthInfo(accessToken, refreshToken, '/');
		} catch (error) {
			console.error('일반 로그인 실패:', error);
			alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.');
		}
	};

	return (
		<Container>
			<Chevron onClick={() => navigate(-1)} />
			{isMobile ? <LogoMobile /> : <LogoWeb />}
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					handleLogin();
				}}
			>
				<Input
					placeholder="이메일"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="비밀번호"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type="submit">로그인</Button>
			</Form>
		</Container>
	);
}

export default GeneralLogin;

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

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
`;

const Input = styled.input`
	width: 280px;
	height: 48px;
	padding: 0 16px;

	border-radius: 5px;
	background: ${({ theme }) => theme.colors.grayWhite};
	border: 1px solid ${({ theme }) => theme.colors.gray300};

	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.regular};

	outline: none;

	&::placeholder {
		color: ${({ theme }) => theme.colors.gray400};
	}

	@media (min-width: 768px) {
		width: 420px;
	}
`;

const Button = styled.button`
	width: 280px;
	height: 48px;

	border-radius: 5px;
	background: ${({ theme }) => theme.colors.pink600};

	color: ${({ theme }) => theme.colors.grayWhite};
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};

	@media (min-width: 768px) {
		width: 420px;

		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	}
`;
