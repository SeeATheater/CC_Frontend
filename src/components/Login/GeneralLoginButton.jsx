import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function GeneralLoginButton() {
	const navigate = useNavigate();

	const handleGeneralLogin = () => {
		navigate('/login/general');
	};

	return <Button onClick={handleGeneralLogin}>일반 로그인하기</Button>;
}

export default GeneralLoginButton;

const Button = styled.button`
	padding: 10px 100px;

	display: flex;
	gap: 8px;
	justify-content: center;
	align-items: center;
	background: ${({ theme }) => theme.colors.pink200};
	border-radius: 5px;

	color: ${({ theme }) => theme.colors.pink600};
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.regular};

	@media (min-width: 768px) {
		width: 420px;
		height: 48px;

		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	}
`;
