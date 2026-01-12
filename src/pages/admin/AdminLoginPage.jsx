import styled from 'styled-components';
import { useState } from 'react';
import Logo from '@/assets/icons/login/AdminLogin.svg?react';
import { useAuth } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/apis/axiosInstance';

const AdminLoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setAuthInfo } = useAuth();

	const handleLoginClick = async () => {
		try {
			const response = await axiosInstance.post('/admin/login', {
				email,
				password,
			});

			const { accessToken, refreshToken } = response.data.result;
			sessionStorage.setItem('selectedRole', 'ADMIN');
			setAuthInfo(accessToken, refreshToken, '/admin/dashboard');
		} catch (error) {
			console.error('관리자 로그인 실패:', error);
			alert('로그인 실패! 이메일 또는 비밀번호를 확인해주세요.');
		}
	};

	return (
		<Container>
			<Logo />

			<div className="input">
				<Input
					placeholder="관리자 이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="비밀번호"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			<Button onClick={handleLoginClick}>로그인</Button>
		</Container>
	);
};

export default AdminLoginPage;

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: ${({ theme }) => theme.colors.gray200};

	svg {
		margin-top: -80px;
	}
`;

const Input = styled.input`
	padding: 20px;
	width: 500px;
	height: 60px;
	display: flex;

	border-radius: 4px;
	background: ${({ theme }) => theme.colors.grayWhite};
	border: 1px solid ${({ theme }) => theme.colors.gray400};

	color: ${({ theme }) => theme.colors.gray900};
	font-size: ${({ theme }) => theme.font.fontSize.text14};
	font-weight: ${({ theme }) => theme.font.fontWeight.medium};

	outline: none;

	&::placeholder {
		color: ${({ theme }) => theme.colors.gray400};
	}
`;

const Button = styled.button`
	margin-top: 32px;
	width: 400px;
	height: 40px;
	border-radius: 4px;
	background: ${({ theme }) => theme.colors.pink600};
	color: ${({ theme }) => theme.colors.grayWhite};
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;
