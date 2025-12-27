import styled from 'styled-components';
import { useState } from 'react';

import { formatDateTime } from '@/utils/formatDateTime';

import Location from '@/assets/icons/location.svg?react';
import Time from '@/assets/icons/time.svg?react';
import Price from '@/assets/icons/price.svg?react';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';

import Cast from './InfoArea/Cast';
import Perform from './InfoArea/Perform';
import Gallery from './InfoArea/Gallery';

function Info({ playData }) {
	const [activeTab, setActiveTab] = useState('perform');

	console.log('InfoData:', playData);

	const displayGenre = playData.result.hashtag
		.split('#')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0)
		.map((tag) => ({ label: tag }));

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

	return (
		<Container>
			<Mobile>
				<Top>
					<ChevronLeftPink alt="이전" />
					<p className="title">{playData?.result.name}</p>
				</Top>
				<img
					src={playData?.result.posterImageUrl}
					height={220}
					alt="포스터 이미지"
					className="poster"
				/>
				<h3 className="title">{playData?.result.name}</h3>
				<TagList>
					{displayGenre.map((genre, index) => (
						<Tag key={index}>{genre.label}</Tag>
					))}
				</TagList>

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
								<span className="blackTxt">{playData?.result.schedule}</span>
								<span className="pinkTxt">{playData?.result.runtime}</span>
							</div>

							<div className="gap8">
								{playData?.result.rounds.map((data) => (
									<p className="grayTxt">
										{data.roundNumber}회차{' '}
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

						<div className="gap10">
							{playData?.result.tickets.map((data) => (
								<div className="ticket">
									<p className="grayTxt discountName">{data.discountName}</p>
									<p className="blackTxt">{data.price}</p>
								</div>
							))}
						</div>
					</InfoBlock>
				</InfoList>

				<TabBar>
					<TabItem
						className={activeTab === 'perform' ? 'active' : ''}
						onClick={() => setActiveTab('perform')}
					>
						공연정보
					</TabItem>
					<TabItem
						className={activeTab === 'cast' ? 'active' : ''}
						onClick={() => setActiveTab('cast')}
					>
						캐스팅
					</TabItem>
					<TabItem
						className={activeTab === 'gallery' ? 'active' : ''}
						onClick={() => setActiveTab('gallery')}
					>
						사진첩
					</TabItem>
				</TabBar>

				<ContentArea>
					{activeTab === 'perform' && <Perform data={playData} />}
					{activeTab === 'cast' && <Cast data={playData} />}
					{activeTab === 'gallery' && <Gallery data={playData} />}
				</ContentArea>

				<BookBtn>예매하러 가기</BookBtn>
			</Mobile>

			<Web>
				<h3 className="title">{playData?.result.name}</h3>
				<WebContent>
					<WebLeft>
						<WebInfo>
							<img
								src={playData?.result.posterImageUrl}
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
													{data.roundNumber}회차{' '}
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

						<TabBar>
							<TabItem
								className={activeTab === 'perform' ? 'active' : ''}
								onClick={() => setActiveTab('perform')}
							>
								공연정보
							</TabItem>
							<TabItem
								className={activeTab === 'cast' ? 'active' : ''}
								onClick={() => setActiveTab('cast')}
							>
								캐스팅
							</TabItem>
							<TabItem
								className={activeTab === 'gallery' ? 'active' : ''}
								onClick={() => setActiveTab('gallery')}
							>
								사진첩
							</TabItem>
						</TabBar>

						<ContentArea>
							{activeTab === 'perform' && <Perform data={playData} />}
							{activeTab === 'cast' && <Cast data={playData} />}
							{activeTab === 'gallery' && <Gallery data={playData} />}
						</ContentArea>
					</WebLeft>

					<BookBtn>예매하러 가기</BookBtn>
				</WebContent>
			</Web>
		</Container>
	);
}

export default Info;

const ChevronLeftPink = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.pink600};
	height: 15px;
	position: absolute;
	left: 0;
`;
const Container = styled.div`
	background: ${({ theme }) => theme.colors.ivoryBg};
`;
const Mobile = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20px;
	.poster {
		border-radius: 3px;
	}
	h3 {
		margin-top: 20px;
		font-size: ${({ theme }) => theme.font.fontSize.headline20};
		font-weight: ${({ theme }) => theme.font.fontWeight.ExtraBold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
	@media (min-width: 768px) {
		display: none;
	}
`;

const Top = styled.div`
	position: relative;
	width: 100%;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;

	.title {
		font-size: ${({ theme }) => theme.font.fontSize.body16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const TagList = styled.div`
	margin-top: 14px;

	display: flex;
	gap: 8px;
`;
const Tag = styled.div`
	display: inline-block;
	padding: 4px 12px;
	border: solid 1px ${({ theme }) => theme.colors.gray300};
	border-radius: 13px;

	font-size: ${({ theme }) => theme.font.fontSize.body12};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.gray400};
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
	@media (min-width: 768px) {
		margin-top: 0px;
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

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	}
`;

const IconWrapper = styled.div`
	height: 24px;
	width: 24px;

	display: flex;
	align-items: center;
	justify-content: center;
`;

const TabBar = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	margin-top: 30px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.pink400};

	position: sticky;
	top: 0;
	background: ${({ theme }) => theme.colors.ivoryBg};
	z-index: 10;
`;

const TabItem = styled.button`
	flex: 1;
	padding: 12px 0;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink400};
	border: none;
	background: transparent;
	position: relative;
	cursor: pointer;

	&.active {
		color: ${({ theme }) => theme.colors.pink600};

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 20%;
			width: 60%;
			height: 2px;
			background: ${({ theme }) => theme.colors.pink600};
			border-radius: 1px;
		}
	}
`;

const ContentArea = styled.div`
	padding: 20px 0;
	width: 100%;
`;
const BookBtn = styled.button`
	width: 100%;
	padding: 20px 100px;
	border-radius: 10px;

	background: ${({ theme }) => theme.colors.pink600};

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayWhite};

	@media (min-width: 768px) {
		padding: 4px 12px;
		width: 300px;
		height: 40px;
	}
`;
const Web = styled.div`
	display: none;
	@media (min-width: 768px) {
		display: flex;
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
