import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Hamburger from '@/components/Hamburger';
import PlayCard from '@/components/Detail/PlayCard';
import NowShowing from '@/components/Detail/NowShowing';
import WebPlayCard from '@/components/Detail/WebPlayCard';
import WebListCard from '@/components/Detail/WebListCard';
import Ticket from '@/assets/icons/Ticket.svg?react';
import SearchPC from '@/pages/search/SearchPC';
import HomeIconMenu from '@/components/HomeIconMenu';
import Footer from '@/components/Footer';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import SamplePoster from '@/assets/mock/images/실종.png';

function Playlist() {
	const [current, setCurrent] = useState(0);
	const navigate = useNavigate();

	const roleToken = sessionStorage.getItem('selectedRole');

	const {
		data: todayData,
		error: todayError,
		loading: todayLoading,
	} = useCustomFetch(`/amateurs/today`);
	console.log('todayData:', todayData);

	const {
		data: rankData,
		error: rankError,
		loading: rankLoading,
	} = useCustomFetch(`/amateurs/ranking`);
	console.log('rankData:', rankData);

	const {
		data: ongoingData,
		error: ongoingError,
		loading: ongoingLoading,
	} = useCustomFetch(`/amateurs/ongoing`);
	console.log('ongoing:', ongoingData);

	const toRegist = () => {
		navigate(`/small-theater/register`);
	};

	return (
		<Container>
			<Web>
				<SideMenuWrapper>
					<HomeIconMenu isWeb={true} selectedMenu="plays" />
				</SideMenuWrapper>
				<WebContent>
					<SearchPC />
					<WebHot>
						<h3 className="Todays">요즘 🔥HOT한 소극장 연극</h3>
						<CardWrapper>
							{rankData?.result.map((data) => (
								<WebPlayCard
									key={data.amateurShowId}
									name={data.name}
									place={data.place}
									posterImageUrl={data.posterImageUrl}
									schedule={data.schedule}
									amateurShowId={data.amateurShowId}
								/>
							))}
						</CardWrapper>
					</WebHot>
					<WebOnGoing>
						<h3>현재 진행중인 소극장 연극</h3>
						<BoxWrapper>
							{ongoingData?.result.content.map((data) => (
								<WebListCard
									key={data.amateurShowId}
									name={data.name}
									place={data.place}
									posterImageUrl={data.posterImageUrl}
									schedule={data.schedule}
									amateurShowId={data.amateurShowId}
								/>
							))}
						</BoxWrapper>
					</WebOnGoing>
				</WebContent>

				<Footer />
			</Web>

			<Mobile>
				<TopWrap>
					<Hamburger />
				</TopWrap>

				<Today>
					<MobileCarousel>
						<h3 className="Todays">오늘 진행하는 소극장 공연</h3>

						<CarouselWrapper>
							<CarouselTrack $current={current}>
								{todayData &&
									todayData?.result.content.map((data, idx) => (
										<Slide key={data.amateurShowId}>
											<PlayCard
												key={data.amateurShowId}
												name={data.name}
												place={data.place}
												posterImageUrl={data.posterImageUrl}
												schedule={data.schedule}
												amateurShowId={data.amateurShowId}
											/>
										</Slide>
									))}
							</CarouselTrack>
						</CarouselWrapper>
						<IndicatorWrapper>
							{todayData &&
								todayData?.result.content.map((_, idx) => (
									<Dot
										key={idx}
										className={idx === current ? 'active' : ''}
										onClick={() => setCurrent(idx)}
									/>
								))}
						</IndicatorWrapper>
					</MobileCarousel>
				</Today>
				<Now>
					<h3 className="onGoing"> 현재 진행중 </h3>
					<MappingArea>
						{ongoingData?.result.content.map((data) => (
							<NowShowing
								key={data.amateurShowId}
								name={data.name}
								place={data.place}
								posterImageUrl={data.posterImageUrl}
								schedule={data.schedule}
								amateurShowId={data.amateurShowId}
							/>
						))}
					</MappingArea>
				</Now>
				{roleToken == 'PERFORMER' && (
					<FixedProdButton>
						<ProdButton onClick={toRegist}>
							<Ticket height={28} />
							<p>공연등록</p>
						</ProdButton>
					</FixedProdButton>
				)}
			</Mobile>
		</Container>
	);
}

export default Playlist;

const Container = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;
const Web = styled.div`
	display: none;

	@media (min-width: 768px) {
		display: flex;

		flex-direction: column;
		width: 100%;
	}
`;
const WebContent = styled.div`
	display: flex;
	padding: 60px 100px 100px 60px;
	margin-left: 100px;
	flex-direction: column;
	gap: 40px;

	h3 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		margin-bottom: 40px;
	}
`;
const WebHot = styled.div`
	@media (min-width: 768px) {
		display: flex;
		flex-direction: column;

		.Todays {
		}
	}
`;
const WebOnGoing = styled.div``;
const BoxWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 80px;
`;
const SideMenuWrapper = styled.div`
	width: 101px;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	flex-shrink: 0;
	display: none;
	background-color: white;
	@media (min-width: 768px) {
		display: block;
	}
`;

const Mobile = styled.div`
	display: flex;
	padding: 20px;
	flex-direction: column;
	@media (min-width: 768px) {
		display: none;
	}
`;

const TopWrap = styled.div`
	@media (min-width: 768px) {
		display: none;
	}
`;

const Today = styled.div`
	margin-bottom: 40px;

	.Todays {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		margin-bottom: 20px;
	}
`;

const CardWrapper = styled.div`
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;

	gap: 32px;
	width: 100%;

	scroll-behavior: smooth;
	&::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`;

const CarouselWrapper = styled.div`
	width: 100%;
	overflow: hidden;
`;

const CarouselTrack = styled.div`
	display: flex;
	transition: transform 0.4s ease-in-out;
	transform: translateX(${({ $current }) => `-${$current * 100}%`});
`;

const Slide = styled.div`
	flex: 0 0 100%;
`;

const IndicatorWrapper = styled.div`
	display: flex;
	justify-content: center;
	gap: 8px;
	margin-top: 16px;
`;
const MobileCarousel = styled.div`
	@media (min-width: 768px) {
		display: none;
	}
`;

const Dot = styled.div`
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: ${({ theme }) => theme.colors.gray300};
	cursor: pointer;

	&.active {
		background: ${({ theme }) => theme.colors.pink600};
	}
`;

const Now = styled.div`
	.onGoing {
		margin-bottom: 24px;
	}
`;

const MappingArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
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
