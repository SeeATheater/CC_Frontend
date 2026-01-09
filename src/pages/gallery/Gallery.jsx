import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import Masonry from '@/components/Masonry';
import MasonryWeb from '@/components/MasonryWeb';
import Hamburger from '@/components/Hamburger';
import SearchPC from '@/pages/search/SearchPC';
import HomeIconMenu from '@/components/HomeIconMenu';
import GalleryIcon from '@/assets/icons/Gallery.svg?react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

function Gallery() {
	const SIZE = 20;
	const navigate = useNavigate();
	const roleToken = sessionStorage.getItem('selectedRole');

	const mobileObserverRef = useRef(null);
	const webObserverRef = useRef(null);

	const { fetchData } = useCustomFetch();

	const [photoList, setPhotoList] = useState([]);
	const [cursorId, setCursorId] = useState(null);
	const [hasNext, setHasNext] = useState(true);
	const [isFetching, setIsFetching] = useState(false);

	const navigateToUpload = () => {
		navigate('/production/upload_photo');
		window.scrollTo(0, 0);
	};

	const fetchPhotos = async () => {
		if (isFetching || !hasNext) return;
		if (cursorId === null && photoList.length > 0) return;

		setIsFetching(true);

		const url =
			cursorId === null
				? `/photoAlbums?size=${SIZE}`
				: `/photoAlbums?cursorId=${cursorId}&size=${SIZE}`;

		try {
			const res = await fetchData(url, 'GET');
			const result = res?.data?.result;
			console.log(result);

			if (result) {
				setPhotoList((prev) => [...prev, ...(result.photoAlbumDTOs || [])]);
				setHasNext(result.hasNext);
				setCursorId(result.nextCursor);
			}
		} finally {
			setIsFetching(false);
		}
	};
	useEffect(() => {
		if (photoList.length === 0) {
			fetchPhotos();
		}
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNext && !isFetching) {
					fetchPhotos();
				}
			},
			{
				rootMargin: '100px',
				threshold: 0,
			},
		);

		const isMobile = window.innerWidth < 768;

		if (isMobile && mobileObserverRef.current) {
			observer.observe(mobileObserverRef.current);
		}
		if (!isMobile && webObserverRef.current) {
			observer.observe(webObserverRef.current);
		}

		return () => observer.disconnect();
	}, [hasNext, isFetching, cursorId]);

	return (
		<>
			<Mobile>
				<Hamburger title={'사진첩'} />
				<Masonry imageData={photoList} />

				<div ref={mobileObserverRef} />

				{isFetching && <ExtraMessage>불러오는 중...</ExtraMessage>}
				{!hasNext && <ExtraMessage>마지막 사진입니다.</ExtraMessage>}

				{roleToken === 'PERFORMER' && (
					<FixedProdButton>
						<ProdButton onClick={navigateToUpload}>
							<GalleryIcon height={28} />
							<p>사진등록</p>
						</ProdButton>
					</FixedProdButton>
				)}
			</Mobile>

			<Web>
				<SideMenuWrapper>
					<HomeIconMenu isWeb={true} selectedMenu="gallery" />
				</SideMenuWrapper>

				<Container>
					<SearchPC />
					<TitleArea>
						<h3>사진첩</h3>
						{roleToken === 'PERFORMER' && (
							<Button onClick={navigateToUpload}>사진 등록</Button>
						)}
					</TitleArea>

					<MasonryWeb imageData={photoList} />

					<div ref={webObserverRef} />

					{isFetching && <ExtraMessage>불러오는 중...</ExtraMessage>}
					{!hasNext && <ExtraMessage>마지막 사진입니다.</ExtraMessage>}
				</Container>
			</Web>
		</>
	);
}

export default Gallery;

const SideMenuWrapper = styled.div`
	width: 101px;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	flex-shrink: 0;
	display: none;

	@media (min-width: 768px) {
		display: block;
	}
`;

const Web = styled.div`
	display: none;
	@media (min-width: 768px) {
		width: 100vw;
		display: flex;
	}
`;
const Mobile = styled.div`
	padding: 0px 20px;
	@media (min-width: 768px) {
		display: none;
	}
`;

const Container = styled.div`
	width: 100%;
	padding: 60px 100px 100px 60px;
	margin-left: 100px;
	display: flex;
	flex-direction: column;
	gap: 40px;

	h3 {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const TitleArea = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
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

const ExtraMessage = styled.p`
	text-align: center;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.medium};
	color: ${({ theme }) => theme.colors.grayMain};
`;
