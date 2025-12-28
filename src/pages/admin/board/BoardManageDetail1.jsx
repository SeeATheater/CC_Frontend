import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Search from '@/assets/icons/searchBlack.svg?react';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import { getAdminBoardDetail, deleteBoard } from './BoardManageApi';
import Modal from '@/pages/board/components/Modal.jsx';
import useModal from '@/pages/board/hooks/useModal.jsx';

function BoardManageDetail1() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchData } = useCustomFetch();
	
	const [searchTerm, setSearchTerm] = useState('');
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	
	const {
		isOpen: isDeleteModalOpen,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal();

	// 게시글 상세 조회
	useEffect(() => {
		const fetchBoardDetail = async () => {
			try {
				setLoading(true);
				const response = await getAdminBoardDetail(fetchData, parseInt(id));

				if (response && response.boardDetail) {
					const boardData = response.boardDetail;

					const transformedPost = {
						id: boardData.boardId,
						title: boardData.title,
						content: boardData.content,
						author: boardData.authorNickname || '익명',
						authorId: boardData.authorId,
						boardType: boardData.boardType,
						likeCount: boardData.likeCount || 0,
						commentCount: boardData.commentCount || 0,
						createdAt: boardData.createdAt,
						isDeleted: boardData.isDeleted || false,
						specialMessage: boardData.specialMessage,
						imgUrls: boardData.imgUrls || [],
					};

					setPost(transformedPost);
				} else {
					console.error('게시글 조회 실패');
					navigate('/admin/board');
				}
			} catch (error) {
				console.error('게시글 조회 중 오류 발생:', error);
				navigate('/admin/board');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchBoardDetail();
		}
	}, [id, navigate]);

	// 게시글 삭제
	const handleDeletePost = async () => {
		try {
			await deleteBoard(fetchData, parseInt(id));
			closeDeleteModal();
			navigate('/admin/board');
		} catch (error) {
			console.error('게시글 삭제 중 오류 발생:', error);
			alert('게시글 삭제 중 오류가 발생했습니다.');
		}
	};

	// 댓글 포함 페이지로 이동
	const handleViewComments = () => {
		navigate(`/admin/board/${id}/comments`);
	};

	if (loading) {
		return (
			<Container>
				<Content>
					<TableArea>
						<LoadingMessage>로딩 중...</LoadingMessage>
					</TableArea>
				</Content>
			</Container>
		);
	}

	if (!post) {
		return (
			<Container>
				<Content>
					<TableArea>
						<ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
					</TableArea>
				</Content>
			</Container>
		);
	}

	const deleteModalActions = [
		{
			label: '취소',
			type: 'cancel',
			onClick: closeDeleteModal,
		},
		{
			label: '삭제',
			type: 'confirm',
			onClick: handleDeletePost,
		},
	];

	return (
		<Container>
			<Content>
				<TableArea>
					<Title>게시판 관리</Title>

					<FilterArea>
						<SearchInput>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="검색어를 입력하세요"
							/>
							<Search width={15} />
						</SearchInput>

						<DeleteButton
							onClick={post.isDeleted ? null : openDeleteModal}
							disabled={post.isDeleted}
						>
							{post.isDeleted ? '삭제된 게시물' : '게시물 내리기'}
						</DeleteButton>
					</FilterArea>

					<PostDetailContainer>
						{post.isDeleted && post.specialMessage && (
							<DeletedNotice>{post.specialMessage}</DeletedNotice>
						)}

						<AuthorSection>
							<AuthorLabel>게시글 작성자:</AuthorLabel>
							<AuthorName>{post.author}</AuthorName>
						</AuthorSection>

						<PostTitleSection>
							<PostTitleLabel>게시글</PostTitleLabel>
						</PostTitleSection>

						<PostContentBox
							onClick={!post.isDeleted && post.commentCount > 0 ? handleViewComments : null}
							clickable={!post.isDeleted && post.commentCount > 0}
						>
							<PostContent>{post.content}</PostContent>

							{/* 이미지 표시 */}
							{post.imgUrls && post.imgUrls.length > 0 && (
								<PostImageContainer>
									{post.imgUrls.map((url, index) => (
										<PostImage key={index} src={url} alt={`게시글 이미지 ${index + 1}`} />
									))}
								</PostImageContainer>
							)}

							{/* 댓글 안내 */}
							{!post.isDeleted && post.commentCount > 0 && (
								<CommentInfo>
									댓글 {post.commentCount}개
								</CommentInfo>
							)}
						</PostContentBox>
					</PostDetailContainer>
				</TableArea>
			</Content>

			{/* 삭제 확인 모달 */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				title="게시글을 삭제하시겠어요?"
				actions={deleteModalActions}
			/>
		</Container>
	);
}

export default BoardManageDetail1;

const Container = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
`;

const Content = styled.div`
	width: 100%;
	display: flex;
`;

const TableArea = styled.div`
	padding: 0px 120px 50px 50px;
	width: 100%;
`;

const Title = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
`;

const FilterArea = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 36px;
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

		&::placeholder {
			color: ${({ theme }) => theme.colors.gray400};
		}
	}
`;

const DeleteButton = styled.button`
	padding: 8px 20px;
	border-radius: 3px;
	border: none;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};
	color: ${({ theme }) => theme.colors.grayWhite};
	background-color: ${({ theme, disabled }) =>
		disabled ? theme.colors.gray400 : theme.colors.pink600};
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

	&:hover {
		opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
	}
`;

const LoadingMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: #666;
`;

const ErrorMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: ${({ theme }) => theme.colors.pink600};
`;

const PostDetailContainer = styled.div`
	margin-top: 31px;
`;

const DeletedNotice = styled.div`
	background-color: #ffebee;
	border: 1px solid #e57373;
	color: #c62828;
	padding: 12px 16px;
	border-radius: 4px;
	margin-bottom: 16px;
	font-size: 14px;
`;

const AuthorSection = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 24px;
`;

const AuthorLabel = styled.span`
	font-size: 16px;
	font-weight: 600;
	color: #000000;
`;

const AuthorName = styled.span`
	font-size: 16px;
	font-weight: 500;
	color: #000000;
`;

const PostTitleSection = styled.div`
	margin-bottom: 16px;
`;

const PostTitleLabel = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #000000;
`;

const PostContentBox = styled.div`
	border: 1px solid #929292;
	padding: 24px 28px;
	background: white;
	// min-height: 400px;
	cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
	opacity: ${(props) => (props.clickable ? 1 : 0.7)};
	transition: all 0.2s ease;

	&:hover {
		box-shadow: ${(props) =>
			props.clickable ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
	}
`;

const PostContent = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: #000000;
	line-height: 1.6;
	margin-bottom: 20px;
	white-space: pre-wrap;
`;

const PostImageContainer = styled.div`
	margin-top: 28px;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
`;

const PostImage = styled.img`
	width: 320px;
	height: 320px;
	object-fit: cover;
	border-radius: 5px;
`;

const CommentInfo = styled.div`
	margin-top: 20px;
	padding: 12px;
	background-color: ${({ theme }) => theme.colors.pink100};
	border-radius: 5px;
	text-align: center;
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.pink600};
`;
