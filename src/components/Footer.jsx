import styled from 'styled-components';

import CClogoBlack from '@/assets/icons/CClogoBlack.svg?react';
import Github from '@/assets/icons/github.png';
import Kakao from '@/assets/icons/kakaotalk.png';
import Instagram from '@/assets/icons/instagram.svg?react';

function Footer() {
	return (
		<FooterWrapper>
			<Info>
				<div className="logo">
					<CClogoBlack />
					씨어씨어터
				</div>
				<div className="infoWrapper">
					<div className="info">
						<div className="ceo">
							<div>사업자 등록번호: 427-35-01598</div>
							<div>대표: 김지원</div>
						</div>
						<div>상호: 씨어씨어터</div>
						<div>
							주소: 경기도 성남시 분당구 무지개로 144, 508동 1101호(구미동,
							무지개마을)
						</div>
						<div>이메일: seeatheater@gmail.com</div>
						<div>전화번호: 010-4490-7174</div>
					</div>
					<div className="service">서비스 이용 약관</div>
					<div className="copyright">ⓒ 2025. CC All Rights Reserved.</div>
				</div>
			</Info>
			<Icons>
				<img src={Github} className="icons" alt="GitHub" />
				<img src={Kakao} className="icons" alt="Kakao" />
				<Instagram className="icons" />
			</Icons>
		</FooterWrapper>
	);
}

export default Footer;

const FooterWrapper = styled.footer`
	margin-top: auto;
	padding: 20px 132px 20px 160px;
	width: 100%;
	// height: 75px;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	z-index: 99;
	background-color: ${({ theme }) => theme.colors.gray200};
	color: ${({ theme }) => theme.colors.gray200};

	@media (max-width: 768px) {
		padding: 16px 20px;
	}
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	.logo {
		display: flex;
		align-items: center;
		gap: 4px;

		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.medium};
		color: ${({ theme }) => theme.colors.grayMain};
	}

	.infoWrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;

		font-size: ${({ theme }) => theme.font.fontSize.body10};

		@media (max-width: 768px) {
			gap: 10px;

			font-size: ${({ theme }) => theme.font.fontSize.body8};
		}
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 2px;

		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
		color: ${({ theme }) => theme.colors.gray400};
	}

	.ceo {
		display: flex;
		gap: 12px;
	}

	.service {
		color: ${({ theme }) => theme.colors.gray500};
	}

	.copyright {
		font-weight: ${({ theme }) => theme.font.fontWeight.medium};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;

const Icons = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;

	.icons {
		width: 16px;
		height: 16px;
	}
`;
