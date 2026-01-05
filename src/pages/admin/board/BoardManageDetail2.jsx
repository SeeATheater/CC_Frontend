import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Search from '@/assets/icons/searchBlack.svg?react';
import Tab from '@/pages/board/components/Icons/Tab.svg';
import Like from '@/pages/board/components/Icons/Like.svg';

import useCustomFetch from '@/utils/hooks/useCustomFetch';
import { getAdminBoardDetail, deleteComment, formatSimpleDate } from './BoardManageApi';
import Modal from '@/pages/board/components/Modal.jsx';
import useModal from '@/pages/board/hooks/useModal.jsx';

function BoardManageDetail2() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchData } = useCustomFetch();
	
	const [searchTerm, setSearchTerm] = useState('');
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [deletedComments, setDeletedComments] = useState(new Set());
	const [hasChanges, setHasChanges] = useState(false);
	const [loading, setLoading] = useState(true);
	const [selectedComment, setSelectedComment] = useState(null);
	
	const {
		isOpen: isDeleteModalOpen,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal();

	// 댓글 트리를 평면 배열로 변환
	const flattenCommentsTree = useCallback((commentList) => {
		const flattenTree = (nodes, level = 0) => {
			const flattened = [];
			nodes.forEach((node) => {
				const transformedComment = {
					id: node.commentId,
					commentId: node.commentId,
					author: node.writer || '익명',
					content: node.content,
					date: formatSimpleDate(node.createdAt),
					memberId: node.memberId,
					replyLevel: level,
					parentId: node.parentId,
					likes: node.likeCount || 0,
					deleted: node.deleted || false,
				};

				flattened.push(transformedComment);

				// 자식 댓글 재귀 처리
				if (node.children && node.children.length > 0) {
					flattened.push(...flattenTree(node.children, level + 1));
				}
			});
			return flattened;
		};

		return flattenTree(commentList);
	}, []);

	// 게시글 및 댓글 조회
	useEffect(() => {
		const fetchBoardDetail = async () => {
			try {
				setLoading(true);
				const response = await getAdminBoardDetail(fetchData, parseInt(id));

				if (response && response.boardDetail) {
					const boardData = response.boardDetail;
					const commentsData = response.comments || [];

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
						imgUrls: boardData.imgUrls || [],
					};

					// 댓글 트리를 평면 배열로 변환
					const sortedComments = flattenCommentsTree(commentsData);

					setPost(transformedPost);
					setComments(sortedComments);
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
	}, [id, navigate, flattenCommentsTree]);

	// 댓글 삭제
	const handleDeleteComment = async (commentId) => {
		try {
			await deleteComment(fetchData, commentId);
			setDeletedComments((prev) => new Set(prev).add(commentId));
			setHasChanges(true);
			closeDeleteModal();
		} catch (error) {
			console.error('댓글 삭제 중 오류 발생:', error);
			alert('댓글 삭제 중 오류가 발생했습니다.');
		}
	};

	// 변경사항 저장 (완료 버튼)
	const handleSaveChanges = () => {
		setHasChanges(false);
		setDeletedComments(new Set());
		navigate(`/admin/board/${id}`);
	};

	// 댓글 삭제 모달 열기
	const openCommentDeleteModal = (comment) => {
		setSelectedComment(comment);
		openDeleteModal();
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
			onClick: () => handleDeleteComment(selectedComment.id),
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

						<CompleteButton onClick={handleSaveChanges} disabled={!hasChanges}>
							완료
						</CompleteButton>
					</FilterArea>

					<PostDetailContainer>
						<AuthorSection>
							<AuthorLabel>게시글 작성자:</AuthorLabel>
							<AuthorName>{post.author}</AuthorName>
						</AuthorSection>

						<PostTitleSection>
							<PostTitleLabel>게시글</PostTitleLabel>
						</PostTitleSection>

						<PostContentBox>
							<PostContent>{post.content}</PostContent>

							{/* 이미지 표시 */}
							{post.imgUrls && post.imgUrls.length > 0 && (
								<PostImageContainer>
									{post.imgUrls.map((url, index) => (
										<PostImage key={index} src={url} alt={`게시글 이미지 ${index + 1}`} />
									))}
								</PostImageContainer>
							)}
						</PostContentBox>

						{/* 댓글 섹션 */}
						<CommentsSection>
							<CommentsSectionTitle>
								댓글 ({comments.length})
							</CommentsSectionTitle>

							<CommentsContainer>
								{comments.length === 0 ? (
									<EmptyComments>댓글이 없습니다.</EmptyComments>
								) : (
									comments.map((comment) => {
										const isDeleted =
											deletedComments.has(comment.id) || comment.deleted;

										return (
											<CommentItem key={comment.id} replyLevel={comment.replyLevel}>
												{/* 대댓글 표시 */}
												{comment.replyLevel > 0 && (
													<ReplyIndicator>
														{Array.from({ length: comment.replyLevel - 1 }).map(
															(_, index) => (
																<div
																	key={index}
																	style={{ width: '24px', height: '24px' }}
																/>
															)
														)}
														<img src={Tab} alt="대댓글" width="24" height="24" />
													</ReplyIndicator>
												)}

												<div>
													{isDeleted ? (
														<DeletedCommentText>
															삭제된 댓글입니다.
														</DeletedCommentText>
													) : (
														<>
															<CommentHeader>
																<div>
																	<CommentAuthor>
																		{comment.memberId === post.authorId
																			? '작성자'
																			: comment.author}
																	</CommentAuthor>
																	<CommentDate>{comment.date}</CommentDate>
																</div>

																<CommentHeaderDelete>
																	<DeleteCommentButton
																		onClick={() => openCommentDeleteModal(comment)}
																	>
																		삭제
																	</DeleteCommentButton>
																</CommentHeaderDelete>
															</CommentHeader>

															<CommentContent>{comment.content}</CommentContent>

															{comment.likes > 0 && (
																<CommentLikeInfo>
																	<img
																		src={Like}
																		alt="좋아요"
																		width="24"
																		height="24"
																	/>
																	<span>{comment.likes}</span>
																</CommentLikeInfo>
															)}
														</>
													)}
												</div>
											</CommentItem>
										);
									})
								)}
							</CommentsContainer>
						</CommentsSection>
					</PostDetailContainer>
				</TableArea>
			</Content>

			{/* 댓글 삭제 확인 모달 */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				title="댓글을 삭제하시겠어요?"
				actions={deleteModalActions}
			/>
		</Container>
	);
}

export default BoardManageDetail2;

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

const CompleteButton = styled.button`
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

const AuthorSection = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 32px;
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
	min-height: 400px;
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

// 댓글 섹션
const CommentsSection = styled.div`
	margin-top: 40px;
`;

const CommentsSectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #000000;
	margin-bottom: 16px;
`;

const CommentsContainer = styled.div`
	border: 1px solid #929292;
	padding: 24px 28px;
	background: white;
	overflow: hidden;
`;

const EmptyComments = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 14px;
	color: #999;
`;

const CommentItem = styled.div`
	position: relative;
	padding: 20px 24px;
	border-bottom: 1px solid #dddddd;
	padding-left: ${(props) => (props.replyLevel ? props.replyLevel * 28 + 4 : 0)}px;

	&:last-child {
		border-bottom: none;
	}
`;

const ReplyIndicator = styled.div`
	position: absolute;
	left: 0;
	top: 20px;
	display: flex;
	gap: 4px;
`;

const CommentHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #000000;
`;

const CommentDate = styled.span`
	margin-left: 8px;
	font-size: 14px;
	font-weight: 400;
	color: #929292;
`;

const CommentHeaderDelete = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const DeleteCommentButton = styled.button`
	background: none;
	border: none;
	font-size: 14px;
	color: #ffbebb;
	cursor: pointer;
	padding: 2px 4px;

	&:hover {
		color: ${({ theme }) => theme.colors.pink600};
	}
`;

const CommentContent = styled.div`
	font-size: 14px;
	font-weight: 400;
	color: #000000;
	line-height: 1.5;
	margin-bottom: 8px;
`;

const DeletedCommentText = styled.div`
	padding: 12px 0;
	color: #999;
	font-style: italic;
	font-size: 13px;
`;

const CommentLikeInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 14px;
	color: #929292;
	margin-top: 8px;
	padding-left: 0;
`;
