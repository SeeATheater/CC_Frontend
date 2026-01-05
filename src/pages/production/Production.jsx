import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Hamburger from '@/components/Hamburger';
import ProdGall from '@/components/Production/ProdGall';
import ProdPlayCard from '@/components/ProdPlayCard';
import LikedButton from '@/components/Production/LikedButton';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Heart from '@/assets/icons/Heart.svg?react';
import HeartFull from '@/assets/icons/heart-full.svg?react';
import Ticket from '@/assets/icons/Ticket.svg?react';
import Gallery from '@/assets/icons/Gallery.svg?react';
import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';

function Production() {
	const { prodId } = useParams();
	const roleToken = sessionStorage.getItem('selectedRole');
	//console.log(roleToken);

	const {
		data: playData,
		error: playError,
		loading: playLoading,
	} = useCustomFetch(`/photoAlbums/member/${prodId}/shows?page=0&size=20`);
	console.log('playData:', playData);

	const {
		data: picData,
		error: picError,
		loading: picLoading,
	} = useCustomFetch(`/photoAlbums/member/${prodId}`);
	console.log('picData:', picData);

	const [activeTab, setActiveTab] = useState('plays');
	const navigate = useNavigate();

	const navigateToDetail = () => {
		navigate(`/production/${prodId}/detail`);
		window.scrollTo(0, 0);
	};
	const navigateToUpload = () => {
		navigate('/production/upload_photo');
		window.scrollTo(0, 0);
	};
	const goBack = () => {
		navigate(-1);
		window.scrollTo(0, 0);
	};

	return (
		<>
			<Mobile>
				<Hamburger back={true} />

				<Theatre>
					<h3 className="production" onClick={navigateToDetail}>
						{picData?.result.performerName}
					</h3>
					<LikedButton prodId={prodId} />
				</Theatre>
				<TabBar>
					<TabItem
						className={activeTab === 'plays' ? 'active' : ''}
						onClick={() => setActiveTab('plays')}
					>
						연극
					</TabItem>
					<TabItem
						className={activeTab === 'gallery' ? 'active' : ''}
						onClick={() => setActiveTab('gallery')}
					>
						사진첩
					</TabItem>
				</TabBar>

				<ContentArea>
					{activeTab === 'plays' && (
						<>
							<SubText>{playData?.result.totalCount}개의 연극</SubText>
							{roleToken == 'PERFORMER' && (
								<FixedProdButton>
									<ProdButton>
										<Ticket height={28} />
										<p>공연등록</p>
									</ProdButton>
								</FixedProdButton>
							)}
							<CardArea>
								{playData?.result.shows.map((data) => (
									<ProdPlayCard
										detailAddress={data.detailAddress}
										posterImageUrl={data.posterImageUrl}
										showId={data.showId}
										status={data.status}
										title={data.title}
									/>
								))}
							</CardArea>
						</>
					)}
					{activeTab === 'gallery' && (
						<>
							<SubText>
								{picData.result.singlePhotoAlbumDTOs.length}개의 사진첩
							</SubText>
							{roleToken == 'PERFORMER' && (
								<FixedProdButton>
									<ProdButton onClick={navigateToUpload}>
										<Gallery height={28} />
										<p>사진등록</p>
									</ProdButton>
								</FixedProdButton>
							)}
							<ProdGall imageData={picData} />
						</>
					)}
				</ContentArea>
			</Mobile>

			<Web>
				<SideBar />
				<Container>
					<Theatre>
						<div className="theatreName">
							<ChevronLeftGray onClick={goBack} />
							<h3 className="production">{picData?.result.performerName}</h3>
						</div>
						{roleToken == 'PERFORMER' && activeTab === 'plays' && (
							<Button>공연 등록</Button>
						)}
						{roleToken == 'PERFORMER' && activeTab === 'gallery' && (
							<Button onClick={navigateToUpload}>사진 등록</Button>
						)}
					</Theatre>
					<AreaSelect>
						<TabItemWeb
							className={activeTab === 'plays' ? 'active' : ''}
							onClick={() => setActiveTab('plays')}
						>
							연극
						</TabItemWeb>
						<TabItemWeb
							className={activeTab === 'gallery' ? 'active' : ''}
							onClick={() => setActiveTab('gallery')}
						>
							사진첩
						</TabItemWeb>
					</AreaSelect>

					<ContentArea>
						{activeTab === 'plays' && (
							<>
								<SubText>{playData?.result.totalCount}개의 연극</SubText>
								<CardArea>
									{playData?.result.shows.map((data) => (
										<ProdPlayCard
											detailAddress={data.detailAddress}
											posterImageUrl={data.posterImageUrl}
											showId={data.showId}
											status={data.status}
											title={data.title}
										/>
									))}
								</CardArea>
							</>
						)}
						{activeTab === 'gallery' && (
							<>
								<SubText>
									{picData.result.singlePhotoAlbumDTOs.length}개의 사진첩
								</SubText>
								<ProdGall imageData={picData} />
							</>
						)}
					</ContentArea>
				</Container>
			</Web>
		</>
	);
}

export default Production;

const ChevronLeftGray = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.gray400};
`;
const Mobile = styled.div`
	padding: 0 20px;

	@media (min-width: 768px) {
		display: none;
	}
`;
const Web = styled.div`
	display: none;
	@media (min-width: 768px) {
		width: 100vw;
		display: flex;
	}
`;
const Container = styled.div`
	width: 100%;
	margin-left: 100px;
	padding: 100px 100px 60px 60px;
`;

const Theatre = styled.div`
	display: flex;
	gap: 15px;
	align-items: center;

	.production {
		font-size: ${({ theme }) => theme.font.fontSize.headline20};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}

	@media (min-width: 768px) {
		justify-content: space-between;

		.theatreName {
			display: flex;
			align-items: center;
			gap: 18px;
		}
		.production {
			font-size: ${({ theme }) => theme.font.fontSize.headline24};
			font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
			color: ${({ theme }) => theme.colors.grayMain};
		}
	}
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
	padding: 16px 0;

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
const SubText = styled.div`
	margin-bottom: 24px;

	font-size: ${({ theme }) => theme.font.fontSize.body10};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.gray400};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
	}
`;

const CardArea = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 19px;

	@media (min-width: 768px) {
		gap: 80px;
	}
`;
const ContentArea = styled.div`
	padding: 20px 0;
	width: 100%;
`;

const FixedProdButton = styled.div`
	position: fixed;
	bottom: 170px;
	right: 22px;
	z-index: 100;
`;

const ProdButton = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	padding: 8px 12px;
	border-radius: 30px;

	background: ${({ theme }) => theme.colors.pink500};
	width: fit-content;

	p {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayWhite};
	}
`;
const SideBar = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100px;
	height: 100vh;
	background-color: ${({ theme }) => theme.colors.grayWhite};
	border-right: 1px solid ${({ theme }) => theme.colors.gray300};
	z-index: 100;
`;
const AreaSelect = styled.div`
	display: flex;
	padding-left: 28px;
	gap: 32px;
`;
const TabItemWeb = styled.button`
	padding: 16px 0;

	font-size: ${({ theme }) => theme.font.fontSize.headline20};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink400};

	border: none;
	background: transparent;
	position: relative;
	cursor: pointer;

	&.active {
		color: ${({ theme }) => theme.colors.pink600};

		&::after {
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
const Button = styled.button`
	display: flex;
	align-items: center;

	padding: 5px 12px;
	border-radius: 3px;

	background: ${({ theme }) => theme.colors.pink500};
	width: fit-content;

	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayWhite};
`;
