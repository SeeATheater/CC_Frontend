import styled from 'styled-components';
import LogoEyes from '@/assets/icons/LogoEyes.svg?react';
import Icon1 from '@/assets/icons/about-cc/icon_1.svg?react';
import Icon2 from '@/assets/icons/about-cc/icon_2.svg?react';
import Icon3 from '@/assets/icons/about-cc/icon_3.svg?react';
import Icon4 from '@/assets/icons/about-cc/icon_4.svg?react';
import Icon5 from '@/assets/icons/about-cc/icon_5.svg?react';
import Icon1Sm from '@/assets/icons/about-cc/icon_1_sm.svg?react';
import Icon2Sm from '@/assets/icons/about-cc/icon_2_sm.svg?react';
import Icon3Sm from '@/assets/icons/about-cc/icon_3_sm.svg?react';
import Icon4Sm from '@/assets/icons/about-cc/icon_4_sm.svg?react';
import Icon5Sm from '@/assets/icons/about-cc/icon_5_sm.svg?react';

import { useNavigate } from 'react-router-dom';
function AboutCC() {
	const navigate = useNavigate();
	return (
		<AboutCCWrapper>
			<div className="only-mobile" style={{ display: 'flex', flex: '1' }}>
				<Wrapper>
					<PinkArea>
						<h3 style={{ marginBottom: '10px' }}>작지만 깊은 이야기</h3>
						<Title>SEE A</Title>
						<Title>THEATER</Title>
						<p style={{ marginTop: '28px', marginBottom: '32px' }}>
							씨씨(CC)는 씨어씨어터의 줄임말이자,
							<br /> See See!—직접 보고, 즐기자는 의미를 담은 플랫폼입니다.{' '}
							<br />
							학교 연극제부터 독립 소극장, 뮤지컬 동아리 공연까지, <br />
							캠퍼스 안팎의 다채로운 공연을 한눈에 보고 쉽게 예매하세요.
						</p>
						<h3 style={{ marginBottom: '120px' }}>
							연극은 어렵지 않아, 그냥 보러 가는 거야.
						</h3>
					</PinkArea>

					<BlackArea>
						<LogoEyesWrapper>
							<LogoEyes />
						</LogoEyesWrapper>
						<ContentWrapper>
							<ItemWrapper align="left">
								<ItemBox>
									<h3>01</h3>
									<h2>소극장 공연</h2>
									<p>
										소극장 공연이란, 학교 연극, 뮤지컬 동아리부터 공연들까지{' '}
										<br />
										직접 공연을 열고 홍보해보세요!
									</p>
									<div>
										<Icon1 />
									</div>
								</ItemBox>
							</ItemWrapper>

							<ItemWrapper align="right">
								<ItemBox>
									<h3>02</h3>
									<h2>사진첩</h2>
									<p>
										공연등록자분들이 비하인드 스토리나 메이킹 사진들을 <br />
										올리는 공간입니다! 심심하시면 구경하러오세요~!
									</p>
									<div>
										<Icon2 />
									</div>
								</ItemBox>
							</ItemWrapper>

							<ItemWrapper align="left">
								<ItemBox>
									<h3>03</h3>
									<h2>게시판</h2>
									<p>취미를 공유해보세요! 좋은 정보들을 얻어가실 수 있어요.</p>
									<Icon3 />
								</ItemBox>
							</ItemWrapper>

							<ItemWrapper align="right">
								<ItemBox>
									<h3>04</h3>
									<h2>알림</h2>
									<p>
										씨어씨어터에 대한 모든 알람은 이메일로 보내집니다 :)
										<br />
										소극장 공연 예매 및 등록시 이메일로 알람이 가고,
										<br /> 예매 시 마이페이지 내 티켓에서 확인하실 수 있습니다.
									</p>
									<div>
										<Icon4 />
									</div>
								</ItemBox>
							</ItemWrapper>

							<ItemWrapper align="left">
								<ItemBox>
									<h3>05</h3>
									<h2>공연 등록</h2>
									<p>
										등록자 계정은 소속당 하나씩만 만들면 됩니다.
										<br />
										등록자는 공연 등록 및 사진첩에 비하인드 스토리나
										<br />
										메이킹 사진들을 올려서 게시할 수 있어요.
										<br />
										홍보게시판에도 홍보글을 올릴 수 있답니다!
									</p>
									<Icon5 />
								</ItemBox>
							</ItemWrapper>
							<Quote>
								기록도 남기고 편한 예매 서비스 궁금하시다면
								<br />
								저희 씨씨 이용하러 가실까요?
							</Quote>
							<button className="btn-primary" onClick={() => navigate('/')}>
								홈 화면으로 가기
							</button>
						</ContentWrapper>
					</BlackArea>
				</Wrapper>
			</div>
			<div className="only-web" style={{ display: 'flex', flex: '1' }}>
				<Wrapper>
					<Top>
						<div style={{}}>
							<Title>SEE A</Title>
							<Title>THEATER</Title>
						</div>
						<div>
							<h3
								style={{
									color: '#FF8585',
									marginBottom: '20px',
									minWidth: '410px',
								}}
							>
								연극은 어렵지 않아, 그냥 보러 가는 거야.
							</h3>
							<p>
								{' '}
								씨씨(CC)는 씨어씨어터의 줄임말이자,
								<br /> See See!—직접 보고, 즐기자는 의미를 담은 플랫폼입니다.{' '}
								<br />
								학교 연극제부터 독립 소극장, 뮤지컬 동아리 공연까지, <br />
								캠퍼스 안팎의 다채로운 공연을 한눈에 보고 쉽게 예매하세요.
							</p>
						</div>
					</Top>
					<Hr />
					<ItemWrapperWeb>
						<div>
							<h3>01</h3>
							<h1>소극장 공연</h1>
							<div style={{ zIndex: '20', position: 'relative' }}>
								<Icon1Sm />
							</div>
						</div>

						<HiddenContent>
							<p>
								소극장 공연이란, 학교 연극, 뮤지컬 동아리부터 공연들까지 직접
								공연을 열고 홍보해보세요!
							</p>
						</HiddenContent>
					</ItemWrapperWeb>
					<Hr />
					<ItemWrapperWeb>
						<div>
							<h3>02</h3>
							<h1>사진첩</h1>
							<Icon2Sm />
						</div>

						<HiddenContent>
							<p>
								{' '}
								공연등록자분들이 비하인드 스토리나 메이킹 사진들을 올리는
								공간입니다! 심심하시면 구경하러오세요~!
							</p>
						</HiddenContent>
					</ItemWrapperWeb>
					<Hr />

					<ItemWrapperWeb>
						<div>
							<h3>03</h3>
							<h1>게시판</h1>
							<Icon3Sm />
						</div>
						<HiddenContent>
							<p>취미를 공유해보세요! 좋은 정보들을 얻어가실 수 있어요.</p>
						</HiddenContent>
					</ItemWrapperWeb>
					<Hr />
					<ItemWrapperWeb>
						<div>
							<h3>04</h3>
							<h1>알림</h1>
							<Icon4Sm />
						</div>
						<HiddenContent>
							<p>
								씨어씨어터에 대한 모든 알람은 이메일로 보내집니다 :) <br />
								소극장 공연 예매 및 등록시 이메일로 알람이 가고, 예매 시
								마이페이지 내 티켓에서 확인하실 수 있습니다.
							</p>
						</HiddenContent>
					</ItemWrapperWeb>
					<Hr />
					<ItemWrapperWeb>
						<div>
							<h3>05</h3>
							<h1>공연 등록</h1>
							<Icon5Sm />
						</div>
						<HiddenContent>
							<p>
								등록자 계정은 소속당 하나씩만 만들면 됩니다. <br />
								등록자는 공연 등록 및 사진첩에 비하인드 스토리나 메이킹 사진들을
								올려서 게시할 수 있어요. <br />
								홍보게시판에도 홍보글을 올릴 수 있답니다!
							</p>
						</HiddenContent>
					</ItemWrapperWeb>
				</Wrapper>
			</div>
		</AboutCCWrapper>
	);
}
export default AboutCC;
const AboutCCWrapper = styled.div`
	display: flex;
	flex: 1;

	@media (min-width: 768px) {
		background: ${({ theme }) => theme.colors.grayMain};
		padding: 100px 70px;
	}
`;

const Wrapper = styled.div`
	background: ${({ theme }) => theme.colors.pink600};
	display: flex;
	flex: 1;
	flex-direction: column;

	@media (min-width: 768px) {
		background: ${({ theme }) => theme.colors.grayMain};
	}

	h3 {
		color: ${({ theme }) => theme.colors.grayWhite};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		letter-spacing: -0.42px;

		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.headline24};
			letter-spacing: -0.72px;
		}
	}

	h2 {
		color: ${({ theme }) => theme.colors.grayWhite};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		letter-spacing: -0.48px;
	}

	p {
		color: ${({ theme }) => theme.colors.grayWhite};
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		line-height: 18px;
		letter-spacing: -0.39px;

		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
			line-height: 25px;
			letter-spacing: -0.48px;
		}
	}

	quote {
		color: ${({ theme }) => theme.colors.grayWhite};
		text-align: center;
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: 24px;
		letter-spacing: -0.48px;
	}
`;

const Title = styled.h1`
	color: ${({ theme }) => theme.colors.grayWhite};
	font-size: 63.327px;
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	line-height: 56.542px;

	@media (min-width: 768px) {
		color: ${({ theme }) => theme.colors.pink600};
		font-size: 126.973px;
		line-height: 125.966px;
	}
`;

const BlackArea = styled.div`
	width: 100%;
	flex-shrink: 0;
	border-top-left-radius: 50% 10%;
	border-top-right-radius: 50% 10%;
	background: ${({ theme }) => theme.colors.grayMain};

	h3 {
		color: ${({ theme }) => theme.colors.pink300};
	}
`;

const PinkArea = styled.div`
	padding: 32px;
`;

const LogoEyesWrapper = styled.div`
	position: absolute;
	top: 420px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 10;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 64px;
	padding: 160px 40px 68px 40px;
	box-sizing: border-box;
`;

const ItemWrapper = styled.div`
	display: flex;
	justify-content: ${(props) =>
		props.align === 'right' ? 'flex-end' : 'flex-start'};
`;

const ItemBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const Quote = styled.blockquote`
	color: ${({ theme }) => theme.colors.grayWhite};
	text-align: center;
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	line-height: 24px;
	letter-spacing: -0.48px;
`;

const WebWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background: ${({ theme }) => theme.colors.grayMain};
`;

const Top = styled.div`
	display: flex;
	flex-direction: row;
	gap: 60px;
	align-items: flex-end;
	margin-bottom: 80px;
`;

const ItemWrapperWeb = styled.div`
	padding: 1rem;
	cursor: pointer;
	display: flex;
	flex-direction: column;

	h1 {
		color: ${({ theme }) => theme.colors.grayWhite};
		font-size: 56.96px;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: 89px;
		letter-spacing: -1.709px;
		margin-right: 8px;
	}

	h3 {
		color: ${({ theme }) => theme.colors.pink400};
	}

	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}
`;

const HiddenP = styled.p`
	max-height: 0;
	opacity: 0;
	overflow: hidden;
	transition: all 0.3s ease;
	margin: 0;
`;

const HiddenContent = styled.div`
	max-height: 0;
	overflow: hidden;
	transition:
		max-height 0.4s ease,
		padding 0.4s ease;
	padding-top: 0;

	${ItemWrapperWeb}:hover & {
		max-height: 100px;
		padding-top: 0.5rem;
	}
`;

const Hr = styled.div`
	border: none;
	min-height: 1px;
	background-color: ${({ theme }) => theme.colors.gray500};
	margin: 1em 0;
`;
