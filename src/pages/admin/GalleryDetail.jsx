import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Search from '@/assets/icons/searchBlack.svg?react';
import SearchBg from '@/assets/icons/searchBlackBg.svg?react';
import Image from '@/assets/mock/images/image1.png';
import Carousel from '@/components/Carousel';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

function GalleryDetail() {
	const { galleryId } = useParams();
	const [searchTerm, setSearchTerm] = useState(' ');

	console.log('galleryId:', galleryId);

	const {
		data: AdminPicData,
		error: AdError,
		loading: AdLoading,
	} = useCustomFetch(galleryId ? `/admin/photoAlbum/${galleryId}` : null);
	console.log('AdError:', AdError);
	console.log('AdLoading:', AdLoading);
	console.log('AdminPicData:', AdminPicData);

	if (AdLoading) {
		return (
			<Container>
				<Content>데이터를 로딩 중입니다...</Content>
			</Container>
		);
	}

	if (!AdminPicData) {
		return (
			<Container>
				<Content>데이터가 존재하지 않습니다.</Content>
			</Container>
		);
	}

	return (
		<Container>
			<Content>
				<GallData>
					<Title>사진첩 관리</Title>
					<div className="serachNadd">
						<SearchInput>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
								}}
								placeholder="검색어를 입력하세요"
							/>
							<Search width={15} />
						</SearchInput>
						<Button>사진첩 내리기</Button>
					</div>

					<p className="uploader">
						게시글 작성자: {AdminPicData?.result?.uploaderName}
					</p>
					<div className="gallery-content">
						<ImageArea>
							<Carousel CarouselData={AdminPicData?.result.imageResultDTOs} />
						</ImageArea>
						<p>{AdminPicData?.result.content}</p>
					</div>
				</GallData>
			</Content>
		</Container>
	);
}

export default GalleryDetail;

const Container = styled.div`
	width: 100vw;
`;

const Content = styled.div`
	width: 100%;
	display: flex;
`;
const GallData = styled.div`
	width: 100%;
	padding: 0px 120px 50px 50px;

	display: flex;
	flex-direction: column;

	.serachNadd {
		display: flex;
		justify-content: space-between;
		margin-bottom: 70px;
	}
	.uploader {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.grayMain};
		margin-bottom: 32px;
	}
	.gallery-content {
		p {
			max-width: 700px;
		}
		border: 1px solid #929292;
		padding: 24px 28px;
	}
`;
const ImageArea = styled.div`
	width: 320px;
	margin-bottom: 40px;
`;

const Title = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
`;
const SearchInput = styled.div`
	display: flex;
	align-items: center;
	padding: 0 10px;
	background: #fff;
	width: 360px;
	height: 32px;
	border-radius: 7px;
	border: 1px solid #000;

	input {
		width: 100%;
		border: none;
		outline: none;
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;

const Button = styled.button`
	padding: 8px 20px;
	border-radius: 3px;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};
	color: ${({ theme }) => theme.colors.grayWhite};
	background-color: ${({ theme }) => theme.colors.pink600};
`;
