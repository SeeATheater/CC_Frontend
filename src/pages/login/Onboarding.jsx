import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LogoWeb from '@/assets/icons/login/LogoWeb.svg?react';
import LogoMobile from '@/assets/icons/login/LogoMobile.svg?react';
import { useIsMobile } from '@/utils/hooks/useIsMobile';

function Onboarding() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const handleLoginClick = (roleType) => {
		navigate(`/login/auth?role=${roleType}`);
	};

	return (
		<Container>
			{isMobile ? <LogoMobile /> : <LogoWeb />}
			<div className="buttons">
				<button onClick={() => handleLoginClick('AUDIENCE')}>
					예매자로 로그인하기
				</button>
				<button onClick={() => handleLoginClick('PERFORMER')}>
					공연 등록자로 로그인하기
				</button>
			</div>
		</Container>
	);
}

export default Onboarding;

const Container = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	gap: 240px;
	justify-content: center;
	align-items: center;

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	button {
		padding: 10px 100px;
		border-radius: 5px;
		background: ${({ theme }) => theme.colors.pink200};
		color: ${({ theme }) => theme.colors.pink600};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
	}

	@media (min-width: 768px) {
		gap: 144px;

		.buttons {
			gap: 20px;
		}

		button {
			width: 420px;
			height: 48px;
			font-weight: ${({ theme }) => theme.font.fontWeight.extrabold};
		}
	}
`;
