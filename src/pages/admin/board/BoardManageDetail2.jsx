import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import { getAdminBoardDetail, deleteComment } from '@/pages/admin/board/BoardManageApi';
import Modal from '@/pages/board/components/Modal.jsx';
import useModal from '@/pages/board/hooks/useModal.jsx';
import Tab from '@/pages/board/components/Icons/Tab.svg';
import Like from '@/pages/board/components/Icons/Like.svg';

function BoardManageDetail2() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [deletedComments, setDeletedComments] = useState(new Set());
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const [selectedComment, setSelectedComment] = useState(null);

    const flattenCommentsTree = useCallback((commentList) => {
        // API트리 구조 댓글 평면 배열로 변환
        const flattenTree = (nodes, level = 0) => {
            const flattened = [];
            nodes.forEach(node => {
                // 현재 노드를 변환하여 추가
                const transformedComment = {
                    id: node.commentId,
                    commentId: node.commentId,
                    author: node.writer || '익명',
                    content: node.content,
                    date: new Date().toLocaleDateString('ko-KR').substring(5), // MM.DD 형식
                    userId: node.memberId,
                    replyLevel: level,
                    parentId: node.parentId,
                    likes: node.likeCount || 0,
                    deleted: node.deleted || false
                };
                
                flattened.push(transformedComment);
                
                // 자식 노드들 재귀적으로 추가
                if (node.children && node.children.length > 0) {
                    flattened.push(...flattenTree(node.children, level + 1));
                }
            });
            return flattened;
        };
        
        return flattenTree(commentList);
    }, []);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const response = await getAdminBoardDetail(parseInt(id));
                
                // API 응답 구조에 맞게 수정
                if (response && response.boardDetail) {
                    const boardData = response.boardDetail;
                    const commentsData = response.comments || [];
                    
                    // 게시글 데이터 변환
                    const transformedPost = {
                        id: boardData.boardId,
                        title: boardData.title,
                        content: boardData.content,
                        author: boardData.authorNickname || '익명',
                        date: new Date(boardData.createdAt).toLocaleDateString('ko-KR'),
                        likes: boardData.likeCount || 0,
                        comments: boardData.commentCount || 0,
                        category: boardData.boardType === 'PROMOTION' ? 'promotion' : 'general',
                        isHot: false,
                        image: boardData.imgUrls || [],
                        userId: boardData.authorId,
                        isDeleted: boardData.isDeleted
                    };
                    
                    // API에서 이미 트리 구조로 온 댓글을 평면 배열로 변환
                    const sortedComments = flattenCommentsTree(commentsData);
                    
                    setPost(transformedPost);
                    setComments(sortedComments);
                } else {
                    console.error('게시글 조회 실패: 잘못된 응답 구조');
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

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await deleteComment(commentId);
            // API가 성공 응답을 반환하면 (빈 응답이어도 200 OK면 성공)
            if (response.success || response.isSuccess || !response.error) {
                setDeletedComments(prev => new Set(prev).add(commentId));
                setHasChanges(true);
                closeDeleteModal();
                console.log('댓글 삭제 성공');
            } else {
                console.error('댓글 삭제 실패:', response.message);
                alert('댓글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleSaveChanges = () => {
        // 변경사항이 이미 서버에 반영되었으므로 상태만 초기화
        setHasChanges(false);
        setDeletedComments(new Set());
        
        // 댓글 없는 페이지로 이동
        navigate(`/admin/board/${id}`);
    };

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
            onClick: closeDeleteModal
        },
        {
            label: '삭제',
            type: 'confirm',
            onClick: () => handleDeleteComment(selectedComment.id)
        }
    ];

    return (
        <Container>
            <Content>
                <TableArea>
                    <BoardHeader
                        title="게시판 관리"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        buttonName="완료"
                        onButtonClick={handleSaveChanges}
                        buttonDisabled={!hasChanges}
                    />

                    <PostDetailContainer>
                        {/* 작성자 정보 */}
                        <AuthorSection>
                            <AuthorLabel>게시글 작성자 :</AuthorLabel>
                            <AuthorName>{post.author}</AuthorName>
                        </AuthorSection>

                        {/* 게시글 제목 */}
                        <PostTitleSection>
                            <PostTitleLabel>게시글</PostTitleLabel>
                        </PostTitleSection>

                        {/* 게시글 내용 박스 */}
                        <PostContentBox>
                            <PostContent>{post.content}</PostContent>
                            
                            {/* 게시글 이미지 */}
                            {post.image && post.image.length > 0 && (
                                <PostImageContainer>
                                    <PostImage src={Array.isArray(post.image) ? post.image[0] : post.image} alt="게시글 이미지" />
                                </PostImageContainer>
                            )}
                        </PostContentBox>

                        {/* 댓글 섹션 */}
                        <CommentsSection>
                            <CommentsSectionTitle>댓글</CommentsSectionTitle>
                            
                            <CommentsContainer>
                            {comments.map((comment) => {
                                const isDeleted = deletedComments.has(comment.id) || comment.deleted;
                                
                                return (
                                    <CommentItem key={comment.id} replyLevel={comment.replyLevel}>
                                        {comment.replyLevel > 0 && (
                                            <ReplyIndicator>
                                                {Array.from({ length: comment.replyLevel - 1 }).map((_, index) => (
                                                    <div key={index} style={{ width: '24px', height: '24px' }} />
                                                ))}
                                                {/* 마지막 단계만 Tab 아이콘 */}
                                                <img src={Tab} alt="대댓글" width="24" height="24" />
                                            </ReplyIndicator>
                                        )}
                                        
                                        <div>
                                            {/* 삭제된 댓글 표시 처리 */}
                                            {isDeleted ? (
                                                // 삭제된 댓글 표시
                                                <div style={{
                                                    padding: '12px 0',
                                                    color: '#999',
                                                    fontStyle: 'italic',
                                                    fontSize: '13px'
                                                }}>
                                                    삭제된 댓글입니다.
                                                </div>
                                            ) : (
                                                <>
                                                    <CommentHeader>
                                                        <div>
                                                            <CommentAuthor>
                                                                {comment.userId === post.userId ? '작성자' : comment.author}
                                                            </CommentAuthor>
                                                            <CommentDate>{comment.date}</CommentDate>
                                                        </div>
                                                        
                                                        <CommentHeaderDelete>
                                                            {/* 관리자용 삭제 버튼 */}
                                                            <DeleteButton 
                                                                onClick={() => openCommentDeleteModal(comment)}
                                                                className="delete"
                                                            >
                                                                삭제
                                                            </DeleteButton>
                                                        </CommentHeaderDelete>
                                                    </CommentHeader>
                                                    
                                                    <CommentContent>{comment.content}</CommentContent>
                                                    
                                                    {comment.likes > 0 && (
                                                        <CommentLikeInfo>
                                                            <img src={Like} alt="좋아요" width="24" height="24" />
                                                            <span>{comment.likes}</span>
                                                        </CommentLikeInfo>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </CommentItem>
                                );
                            })}
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
    color: #f67676;
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
`;

const PostImage = styled.img`
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 5px;
`;

// 댓글 섹션 스타일
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

const CommentItem = styled.div`
    position: relative;
    padding: 20px 24px;
    border-bottom: 1px solid #DDDDDD;
    padding-left: ${props => props.replyLevel ? props.replyLevel * 28 + 4 : 0}px;

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

const DeleteButton = styled.button`
    background: none;
    border: none;
    font-size: 14px;
    color: #FFBEBB;
    cursor: pointer;
    padding: 2px 4px;

    &:hover {
        color: #F67676;
    }
`;

const CommentContent = styled.div`
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.isDeleted ? '#929292' : '#000000'};
    line-height: 1.5;
    margin-bottom: 8px;
    font-style: ${props => props.isDeleted ? 'italic' : 'normal'};
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