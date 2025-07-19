import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import { mockPosts } from './BoardManage';
import Modal from '../../../pages/board/components/Modal.jsx';
import useModal from '../../../pages/board/hooks/useModal.jsx';

function BoardManageDetail1() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [post, setPost] = useState(null);
    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

    useEffect(() => {
        const foundPost = mockPosts.find(p => p.id === parseInt(id));
        if (foundPost) {
            setPost(foundPost);
        } else {
            navigate('/admin/board');
        }
    }, [id, navigate]);

    const handleDeletePost = () => {
        // 게시글 삭제 로직
        console.log('게시글 삭제:', id);
        closeDeleteModal();
        navigate('/admin/board');
    };

    const handlePostClick = () => {
        // 댓글 포함 페이지로 이동
        navigate(`/admin/board/${id}/comments`);
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
                        buttonName="게시물 내리기"
                        onButtonClick={openDeleteModal}
                    />

                    <PostDetailContainer>
                        <AuthorSection>
                            <AuthorLabel>게시글 작성자 :</AuthorLabel>
                            <AuthorName>{post.author}</AuthorName>
                        </AuthorSection>

                        <PostTitleSection>
                            <PostTitleLabel>게시글</PostTitleLabel>
                        </PostTitleSection>

                        <PostContentBox onClick={handlePostClick}>
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
    cursor: pointer;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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