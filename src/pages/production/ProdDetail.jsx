import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Hamburger from '@/components/Hamburger';
import Carousel from '@/components/Carousel';
import ConfirmDeleteModal from '@/components/Production/ConfirmDeleteModal';
import Footer from '@/components/Footer';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';
import ThreeDots from '@/assets/icons/threeDotsVertical.svg?react';
import EditPen from '@/assets/icons/EditPen.svg?react';
import Trash from '@/assets/icons/Trash.svg?react';

function ProdDetail() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const menuRef = useRef(null);
	const { prodId } = useParams();
	const { AlbumId } = useParams();
	const { fetchData } = useCustomFetch();
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
		window.scrollTo(0, 0);
	};
	const goDetail = (showId) => {
		navigate(`/plays/detail/${showId}`);
		window.scrollTo(0, 0);
	};

	const {
		data: picData,
		error: picError,
		loading: picLoading,
	} = useCustomFetch(`/photoAlbums/member/${prodId}`);

	const {
		data: AlbumData,
		error: AlbumError,
		loading: AlbumLoading,
	} = useCustomFetch(`/photoAlbums/${AlbumId}`);

	console.log('picData', picData);
	console.log('AlbumData', AlbumData);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleDeleteAlbum = async () => {
		try {
			await fetchData(`/photoAlbums/${AlbumId}`, 'DELETE');

			setIsDeleteModalOpen(false);

			// 삭제 후 이동 (상황에 맞게 조정)
			navigate(-1); // 이전 페이지로
		} catch (error) {
			console.error('삭제 실패', error);
			alert('삭제에 실패했습니다.');
		}
	};

	return (
		<>
			<Mobile>
				<Padding>
					<Hamburger back={true} title={picData?.result.performerName} />

					<Content>
						<Carousel
							CarouselData={AlbumData?.result.imageResultWithPresignedUrlDTOs}
						/>

						<TextArea>
							<h3 className="title">{AlbumData?.result.amateurShowName}</h3>

							<p className="subInfo">{AlbumData?.result.schedule}</p>
							<p className="subInfo">{AlbumData?.result.detailAddress}</p>
							<Hr />
							<p className="message">{AlbumData?.result.content}</p>
						</TextArea>
					</Content>
					<Divide />
					<MorePic>
						<p className="galleryTitle">
							'{picData?.result?.content[0]?.performerName}'의 사진첩 더보기
						</p>
						<ImgList>
							{picData?.result?.content.map((data) => (
								<ImgCard
									onClick={() => {
										navigate(
											`/production/album/${prodId}/${data.photoAlbumId}`,
										);
									}}
								>
									<img
										src={data?.imageResultWithPresignedUrlDTO?.presignedUrl}
									/>
									<p>{data.amateurShowName}</p>
								</ImgCard>
							))}
						</ImgList>
					</MorePic>
				</Padding>

				<Footer />
			</Mobile>

			<Web>
				{isDeleteModalOpen && (
					<ConfirmDeleteModal
						isOpen={isDeleteModalOpen}
						onCancel={() => setIsDeleteModalOpen(false)}
						onConfirm={handleDeleteAlbum}
					/>
				)}
				<SideBar />

				<Container>
					<Padding>
						<Production>
							<ChevronLeftGray onClick={goBack} />
							<h3 className="productionName">
								{picData?.result.performerName}
							</h3>
						</Production>
						<Intro>
							<div className="photoArea">
								<Carousel
									CarouselData={
										AlbumData?.result.imageResultWithPresignedUrlDTOs
									}
								/>
							</div>

							<TextArea>
								<div className="titleBar">
									<div className="titleArea">
										<h3 className="title">
											{AlbumData?.result.amateurShowName}
										</h3>
										<ChevronRightGray
											onClick={() => goDetail(AlbumData?.result?.amateurShowId)}
										/>
									</div>
									<MenuWrapper ref={menuRef}>
										<ThreeDots onClick={toggleMenu} />

										{isMenuOpen && (
											<Menu>
												<MenuItem
													onClick={() => {
														setIsMenuOpen(false);
														// 수정 로직
													}}
													className="editText"
												>
													<StyledPen width={16} height={16} />
													<span>수정하기 </span>
												</MenuItem>

												<MenuItem
													className="deleteText"
													onClick={() => {
														setIsMenuOpen(false);
														setIsDeleteModalOpen(true);
													}}
												>
													<StyledTrash width={16} height={16} />
													<span>삭제하기</span>
												</MenuItem>
											</Menu>
										)}
									</MenuWrapper>
								</div>
								<p className="subInfo">{AlbumData?.result.schedule}</p>
								<p className="subInfo">{AlbumData?.result.detailAddress}</p>
								<Hr />
								<p className="message">{AlbumData?.result.content}</p>
							</TextArea>
						</Intro>

						<Hr />
						<MorePic>
							<p className="galleryTitle">
								'{picData?.result?.content[0]?.performerName}'의 사진첩 더보기
							</p>
							<ImgList>
								{picData?.result.content.map((data) => (
									<ImgCard
										onClick={() => {
											navigate(
												`/production/album/${prodId}/${data.photoAlbumId}`,
											);
										}}
									>
										<img
											src={data?.imageResultWithPresignedUrlDTO?.presignedUrl}
										/>
										<div className="textArea">
											<p className="title">{data.amateurShowName}</p>
											<p className="theatre">{data.detailAddress}</p>
										</div>
									</ImgCard>
								))}
							</ImgList>
						</MorePic>
					</Padding>
					<Footer />
				</Container>
			</Web>
		</>
	);
}

export default ProdDetail;

const ChevronLeftGray = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.gray400};
	cursor: pointer;
`;
const ChevronRightGray = styled(ChevronRight)`
	color: ${({ theme }) => theme.colors.gray400};
	cursor: pointer;
`;
const StyledTrash = styled(Trash)`
	color: ${({ theme }) => theme.colors.grayMain};
`;
const StyledPen = styled(EditPen)`
	color: ${({ theme }) => theme.colors.redWarning};
`;

const Mobile = styled.div`
	@media (min-width: 768px) {
		display: none;
	}
`;
const Web = styled.div`
	display: none;
	@media (min-width: 768px) {
		display: flex;
		width: 100%;
	}
`;

const Container = styled.div`
	width: 100%;

	@media (min-width: 768px) {
		margin-left: 100px;
	}
`;

const Padding = styled.div`
	padding: 0px 20px;
	margin-bottom: 40px;

	@media (min-width: 768px) {
		padding: 60px 100px 100px 60px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;

	.photo {
		background: ${({ theme }) => theme.colors.gray400};
		width: 100%;
		aspect-ratio: 1;
		border-radius: 10px;
	}
	margin-bottom: 40px;
`;
const TextArea = styled.div`
	flex: 1;

	.title {
		font-size: ${({ theme }) => theme.font.fontSize.headline20};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};

		margin-bottom: 14px;

		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.headline24};
			margin-bottom: 0;
		}
	}
	.subInfo {
		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.gray500};

		margin-bottom: 14px;

		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.body13};
		}
	}
	.message {
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};

		margin-top: 16px;

		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
		}
	}

	@media (min-width: 768px) {
		.titleArea {
			display: flex;
			gap: 15px;
			align-items: center;
		}
		.titleBar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16px;
		}
	}
`;
const Hr = styled.div`
	border-bottom: solid ${({ theme }) => theme.colors.pink200} 1px;
`;
const Divide = styled.div`
	border-bottom: solid ${({ theme }) => theme.colors.pink200} 4px;
	width: 100vw;
	margin-left: calc(-50vw + 50%);
	@media (min-width: 768px) {
		border-bottom: solid #e6e6e6 1px;
	}
`;
const MorePic = styled.div`
	width: 100%;
	padding-top: 24px;

	.galleryTitle {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};

		margin-bottom: 18px;
	}

	@media (min-width: 768px) {
		width: 100%;
		.galleryTitle {
			font-size: ${({ theme }) => theme.font.fontSize.headline20};
		}
	}
`;
const ImgList = styled.div`
	display: flex;
	gap: 12px;
	overflow-x: auto;
	overflow-y: hidden;
	width: 100%;
	&::-webkit-scrollbar {
		display: none;
	}
`;
const ImgCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	img {
		width: 128px;
		flex-shrink: 0;
		aspect-ratio: 1/1;
		border-radius: 3px;
		object-fit: cover;
	}
	p {
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}

	@media (min-width: 768px) {
		img {
			width: 270px;
			border-radius: 5px;
			aspect-ratio: unset;
			max-height: 350px;
		}
		.textArea {
			display: flex;
			gap: 8px;
			align-items: center;
		}
		.title {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
		}
		.theatre {
			font-size: ${({ theme }) => theme.font.fontSize.body13};
			font-weight: ${({ theme }) => theme.font.fontWeight.regular};
			color: ${({ theme }) => theme.colors.gray400};
		}
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
const Production = styled.div`
	display: flex;
	gap: 18px;
	align-items: center;
	margin-bottom: 48px;

	.productionName {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const Intro = styled.div`
	width: 100%;
	display: flex;
	gap: 40px;

	padding-bottom: 100px;

	.photoArea {
		width: 440px;
	}
`;

const MenuWrapper = styled.div`
	position: relative;
`;

const Menu = styled.div`
	position: absolute;
	top: 32px;
	right: 0;

	width: 220px;
	background-color: ${({ theme }) => theme.colors.grayWhite};
	border-radius: 8px;
	box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);

	display: flex;
	flex-direction: column;
	z-index: 10;
`;

const MenuItem = styled.button`
	height: 54px;
	padding: 0 20px;

	display: flex;
	gap: 12px;
	align-items: center;

	background: none;
	border: none;
	cursor: pointer;

	font-size: ${({ theme }) => theme.font.fontSize.body14};
	color: ${({ theme }) => theme.colors.blackMain};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};

	&:hover {
		background-color: ${({ theme }) => theme.colors.gray2};
	}

	&.deleteText {
		color: ${({ theme }) => theme.colors.redWarning};
	}
`;
