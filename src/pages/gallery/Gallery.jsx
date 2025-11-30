import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Masonry from '@/components/Masonry';
import MasonryWeb from '@/components/MasonryWeb';
import Hamburger from '@/components/Hamburger';
import SearchBar from '@/components/SearchBar';
import HomeIconMenu from '@/components/HomeIconMenu';
import GalleryIcon from '@/assets/icons/Gallery.svg?react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

function Gallery() {
	const navigate = useNavigate();
	const roleToken = sessionStorage.getItem('selectedRole');
	const [cursorId, setCursorId] = useState(0);

	const navigateToUpload = () => {
		navigate('/production/upload_photo');
		window.scrollTo(0, 0);
	};

	const {
		data: picData,
		error,
		loading,
	} = useCustomFetch(`/photoAlbums?cursorId=${cursorId}&size=15`);
	console.log('picData', picData);

	if (loading) {
		return <div>로딩 중...</div>;
	}

	return (
		<>
			<Mobile>
				<Hamburger title={'사진첩'} />
				<Masonry imageData={picData?.result} />
				{roleToken == 'PERFORMER' && (
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
					<SearchBar />
					<TitleArea>
						<h3>사진첩</h3>
						{roleToken == 'PERFORMER' && (
							<Button onClick={navigateToUpload}>사진 등록</Button>
						)}
					</TitleArea>

					<MasonryWeb imageData={picData?.result} />
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
