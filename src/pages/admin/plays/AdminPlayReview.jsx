import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';
import ChevronDown from '@/assets/icons/chevronDown.svg?react';
import Location from '@/assets/icons/location.svg?react';
import Time from '@/assets/icons/time.svg?react';
import Price from '@/assets/icons/price.svg?react';

import Summary from '@/pages/Detail/Summary';
import Gallery from '@/pages/Detail/InfoArea/Gallery';
import EyeRollingSVG from '@/components/EyeRollingSVG.jsx';

import Staff from '@/components/Detail/Staff';
import CastCardCheck from '@/components/Admin/CastCardCheck';
import AddCastCard from '@/components/Admin/AddCastCard';

import poster from '@/assets/mock/images/실종.png';
import profile from '@/assets/mock/images/프로필.png';

function AdminPlayReview() {
	const location = useLocation();
	const { playId } = useParams();
	const showStatus = location.state?.showStatus;
	console.log('showStatus', showStatus);
	console.log('playId', playId);

	const {
		data: playData,
		error: playError,
		loading: playLoading,
	} = useCustomFetch(`/amateurs/${playId}`);
	console.log('playData', playData);

	function formatDateTime(dateString) {
		const date = new Date(dateString);

		// 월, 일
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		// 요일
		const days = ['일', '월', '화', '수', '목', '금', '토'];
		const dayOfWeek = days[date.getDay()];

		// 시간, 분
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
	}

	const navigate = useNavigate();
	const goRegister = () => {
		navigate(`/admin/plays/${playId}/register`);
	};

	if (playLoading || !playData?.result) {
		return <EyeRollingSVG />;
	}

	return (
		<Container>
			<Summary playData={playData} />

			<Info>
				<h3 className="title">실종</h3>
				<WebContent>
					<WebLeft>
						<WebInfo>
							<img
								src={poster}
								height={220}
								alt="포스터 이미지"
								className="poster"
							/>
							<InfoList>
								<InfoBlock>
									<IconWrapper>
										<Location height={24} />
									</IconWrapper>

									<p className="blackTxt">
										{playData?.result.hallName} {playData?.result.detailAddress}
									</p>
								</InfoBlock>
								<InfoBlock>
									<IconWrapper>
										<Time height={24} />
									</IconWrapper>

									<div className="gap10">
										<div>
											<span className="blackTxt">
												{playData?.result.schedule}
											</span>
											<span className="pinkTxt">
												{playData?.result.runtime}
											</span>
										</div>
										<div className="gap12">
											{playData?.result.rounds.map((data) => (
												<p className="grayTxt">
													{data.roundNumber}회차
													{formatDateTime(data.performanceDateTime)}
												</p>
											))}
										</div>
									</div>
								</InfoBlock>
								<InfoBlock>
									<IconWrapper>
										<Price height={24} />
									</IconWrapper>

									<div className="gap12">
										{playData?.result.tickets.map((data) => (
											<div className="ticket">
												<p className="grayTxt discountName">
													{data.discountName}
												</p>
												<p className="blackTxt">{data.price}</p>
											</div>
										))}
									</div>
								</InfoBlock>
							</InfoList>
						</WebInfo>

						<ContentArea>
							<SubArea>
								<Title>공연 정보</Title>
								<SubTitle>공연시간 정보</SubTitle>
								<Text>{playData?.result.notice.timeInfo} </Text>
								<SubTitle>공지사항</SubTitle>
								<Text>{playData?.result.notice.content} </Text>
								<img
									src={playData?.result.notice.noticeImageUrl}
									alt="포스터 이미지"
									className="posterImg"
								/>
								<SubTitle>공연장 정보</SubTitle>
								<Text>{playData?.result.roadAddress}</Text>
								<div className="Map" />
							</SubArea>

							<SubArea>
								<Title>캐스팅 정보</Title>
								<SubTitle>출연</SubTitle>
								<Cast>
									{playData?.result.casting.map((data) => (
										<CastCardCheck
											key={data.castingId}
											path={data.castingImageUrl}
											name={data.actorName}
											role={data.castingName}
										/>
									))}
									<AddCastCard />
								</Cast>
								<SubTitle>감독 및 스태프</SubTitle>
								{playData?.result.staff.map((data) => (
									<Staff
										key={data.staffId}
										name={data.staffName}
										role={data.position}
									/>
								))}
							</SubArea>

							<SubArea>
								<Title>사진첩</Title>
								<Gallery data={playData} />
							</SubArea>
						</ContentArea>
					</WebLeft>

					<BookBtn onClick={goRegister}>등록/반려하러 가기</BookBtn>
				</WebContent>
			</Info>
		</Container>
	);
}

export default AdminPlayReview;

const Container = styled.div`
	width: 100vw;
`;

const Content = styled.div``;
const Top = styled.div`
	padding-top: 44px;
	height: 87px;
	display: flex;
	align-items: center;
`;
const TagList = styled.div`
	margin-top: 20px;

	display: flex;
	gap: 8px;

	@media (min-width: 768px) {
		display: flex;
		gap: 12px;
	}
`;
const Tag = styled.div`
	display: inline-block;
	padding: 4px 12px;
	border: solid 1px ${({ theme }) => theme.colors.gray300};
	border-radius: 13px;

	font-size: ${({ theme }) => theme.font.fontSize.body12};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayWhite};

	@media (min-width: 768px) {
		padding: 1px 40px;
		border-radius: 3px;
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayWhite};
	}
`;

const Info = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 40px 100px 0px 160px;

	.poster {
		border-radius: 3px;
	}
	h3 {
		font-size: ${({ theme }) => theme.font.fontSize.headline36};
		font-weight: ${({ theme }) => theme.font.fontWeight.ExtraBold};
		color: ${({ theme }) => theme.colors.grayMain};
		margin-bottom: 28px;
	}
`;
const WebContent = styled.div`
	display: flex;
	gap: 65px;
`;
const WebLeft = styled.div`
	width: 839px;
`;
const WebInfo = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 40px;
`;
const InfoList = styled.div`
	margin-top: 20px;
	width: 100%;
	background: ${({ theme }) => theme.colors.pink100};
	padding: 20px;

	display: flex;
	flex-direction: column;
	gap: 32px;

	.blackTxt {
		color: ${({ theme }) => theme.colors.grayMain};
	}
	.pinkTxt {
		color: ${({ theme }) => theme.colors.pink600};
		margin-left: 8px;
	}
	.grayTxt {
		color: ${({ theme }) => theme.colors.gray400};
	}
	.discountName {
		min-width: 80px;
	}
	.gap8 {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.gap10 {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.gap12 {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
`;

const InfoBlock = styled.div`
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};

	display: flex;
	gap: 32px;

	.ticket {
		display: flex;
	}
`;

const IconWrapper = styled.div`
	height: 24px;
	width: 24px;

	display: flex;
	align-items: center;
	justify-content: center;
`;

const InfoContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;
const StyledText = styled.span`
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.medium};

	&.default {
		color: ${({ theme }) => theme.colors.gray900};
	}
	&.highlight {
		color: ${({ theme }) => theme.colors.pink500};
	}
	&.deem {
		color: ${({ theme }) => theme.colors.gray500};
	}
`;

const ContentArea = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 32px;
	.posterImg {
		width: 500px;
		border-radius: 10px;
	}
`;

const SubArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;

	.Map {
		background-color: ${({ theme }) => theme.colors.gray200};
		width: 816px;
		height: 332px;
	}
`;
const Cast = styled.div`
	display: flex;
	gap: 32px;
	flex-wrap: wrap;
`;
const BookBtn = styled.button`
	padding: 4px 12px;
	width: 300px;
	height: 40px;

	background: ${({ theme }) => theme.colors.pink600};

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayWhite};
`;
const Title = styled.div`
	padding-bottom: 12px;
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink600};
	border-bottom: 1px solid #e6e6e6;
`;
const SubTitle = styled.p`
	//margin-bottom: 10px;
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayMain};
`;
const Text = styled.p`
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};
`;
