import { useState, useEffect, useCallback  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import { mockPosts, mockComments } from './BoardManage';
import Modal from '../../../pages/board/components/Modal.jsx';
import useModal from '../../../pages/board/hooks/useModal.jsx';
import Tab from '../../../pages/board/components/Icons/Tab.svg';
import Like from '../../../pages/board/components/Icons/Like.svg';

function BoardManageDetail2() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [deletedComments, setDeletedComments] = useState(new Set());
    const [hasChanges, setHasChanges] = useState(false);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const [selectedComment, setSelectedComment] = useState(null);

    const sortCommentsAsTree = useCallback((commentList) => {
        const result = [];
        const commentMap = new Map();
        
        // 모든 댓글을 Map에 저장
        commentList.forEach(comment => {
            commentMap.set(comment.id, { ...comment, children: [] });
        });
        
        // 부모-자식 관계 설정 및 루트 댓글 수집
        commentList.forEach(comment => {
            if (comment.parentId === null) {
                // 루트 댓글 (일반 댓글)
                result.push(commentMap.get(comment.id));
            } else {
                // 대댓글인 경우 부모의 children에 추가
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.children.push(commentMap.get(comment.id));
                }
            }
        });
        
        // 트리를 평면 배열로 변환 (깊이 우선 탐색)
        const flattenTree = (nodes, level = 0) => {
            const flattened = [];
            nodes.forEach(node => {
                // 현재 노드 추가
                flattened.push({ ...node, replyLevel: level });
                // 자식 노드들 재귀적으로 추가
                if (node.children && node.children.length > 0) {
                    flattened.push(...flattenTree(node.children, level + 1));
                }
            });
            return flattened;
        };
        
        return flattenTree(result);
    }, []);

    useEffect(() => {
        const foundPost = mockPosts.find(p => p.id === parseInt(id));
        const foundComments = mockComments[id] || [];
        
        if (foundPost) {
            setPost(foundPost);
            const sortedComments = sortCommentsAsTree(foundComments);
            setComments(sortedComments);
        } else {
            navigate('/admin/board');
        }
    }, [id, navigate, sortCommentsAsTree]);

    const handleDeleteComment = (commentId) => {
        setDeletedComments(prev => new Set(prev).add(commentId));
        setHasChanges(true);
        closeDeleteModal();
    };

    const handleSaveChanges = () => {
        // 변경사항 저장 로직
        console.log('삭제된 댓글들:', Array.from(deletedComments));
        
        // 실제로는 API 호출로 서버에 저장
        // 여기서는 목 데이터 업데이트
        mockComments[id] = comments.filter(comment => !deletedComments.has(comment.id));
        
        setHasChanges(false);
        setDeletedComments(new Set());
        
        // 저장 완료 후 댓글 없는 페이지로 이동
        navigate(`/admin/board/${id}`);
    };

    const openCommentDeleteModal = (comment) => {
        setSelectedComment(comment);
        openDeleteModal();
    };

    if (!post) return null;

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
                        buttonName="저장하기"
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
                            {post.image.length > 0 && (
                                <PostImageContainer>
                                    {Array.isArray(post.image) ? (
                                        <PostImage src={post.image[0]} alt="게시글 이미지" />
                                    ) : (
                                        <PostImage src={post.image} alt="게시글 이미지" />
                                    )}
                                </PostImageContainer>
                            )}
                        </PostContentBox>

                        {/* 댓글 섹션 */}
                        <CommentsSection>
                            <CommentsSectionTitle>댓글</CommentsSectionTitle>
                            
                            <CommentsContainer>
                            {comments.map((comment) => {
                                const isDeleted = deletedComments.has(comment.id);
                                
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
