import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import { getAdminBoardDetail, deleteBoard } from '@/pages/admin/board/BoardManageApi';
import Modal from '@/pages/board/components/Modal.jsx';
import useModal from '@/pages/board/hooks/useModal.jsx';

function BoardManageDetail1() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const response = await getAdminBoardDetail(parseInt(id));
                
                if (response && response.boardDetail) {
                    const boardData = response.boardDetail;
                    
                    // API 데이터를 기존 컴포넌트 형식에 맞게 변환
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
                        isDeleted: boardData.isDeleted,
                        specialMessage: boardData.specialMessage
                    };
                    
                    setPost(transformedPost);
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
    }, [id, navigate]);

    const handleDeletePost = async () => {
        try {
            const response = await deleteBoard(parseInt(id));
            if (response.success || response.isSuccess || !response.error)  {
                console.log('게시글 삭제 성공');
                closeDeleteModal();
                navigate('/admin/board');
            } else {
                console.error('게시글 삭제 실패:', response.message);
                alert('게시글 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('게시글 삭제 중 오류 발생:', error);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        }
    };

    const handlePostClick = () => {
        // 댓글 포함 페이지로 이동
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
            onClick: closeDeleteModal
        },
        {
            label: '삭제',
            type: 'confirm',
            onClick: handleDeletePost
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
                        buttonName={post.isDeleted ? "삭제된 게시물" : "게시물 내리기"}
                        onButtonClick={post.isDeleted ? null : openDeleteModal}
                        buttonDisabled={post.isDeleted}
                    />

                    <PostDetailContainer>
                        {post.isDeleted && post.specialMessage && (
                            <DeletedNotice>
                                {post.specialMessage}
                            </DeletedNotice>
                        )}
                        
                        <AuthorSection>
                            <AuthorLabel>게시글 작성자 :</AuthorLabel>
                            <AuthorName>{post.author}</AuthorName>
                        </AuthorSection>

                        <PostTitleSection>
                            <PostTitleLabel>게시글</PostTitleLabel>
                        </PostTitleSection>

                        <PostContentBox onClick={!post.isDeleted ? handlePostClick : null} clickable={!post.isDeleted}>
                            <PostContent>{post.content}</PostContent>
                            
                            {/* 게시글 이미지 */}
                            {post.image && post.image.length > 0 && (
                                <PostImageContainer>
                                    <PostImage src={Array.isArray(post.image) ? post.image[0] : post.image} alt="게시글 이미지" />
                                </PostImageContainer>
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
};

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

const DeletedNotice = styled.div`
	background-color: #ffebee;
	border: 1px solid #e57373;
	color: #c62828;
	padding: 12px 16px;
	border-radius: 4px;
	margin-bottom: 16px;
	font-size: 14px;
`;

const PostDetailContainer = styled.div`
    margin-top: 31px;
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
    min-height: 400px;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
    opacity: ${props => props.clickable ? 1 : 0.7};

    &:hover {
        box-shadow: ${props => props.clickable ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
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
`;

const PostImage = styled.img`
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 5px;
`;