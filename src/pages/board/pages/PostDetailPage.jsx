
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, SideMenuWrapper, HeaderIcons, HeaderIcon, EmptyHeaderIcon } from '@/pages/board/styles/commonStyles';
import {
  ContentArea, PostDetailContainer, PostHeader, PostTitle,
  PostContent, PostMeta, PostAuthor, PostDate,
  PostActions, LikeButton, LikeIcon, ImageContainer,
  PostImage, ImagePagination, PaginationDot, CommentsSection,
  CommentsSectionTitle, CommentItem, CommentHeader, CommentAuthor,
  CommentDate, CommentContent, CommentButton, CommentIcon,
  CommentLikeInfo, ReplyIndicator, CommentInput, CommentInputContainer,
  CommentSubmitButton, CommentHeaderActions, CommentActionButton,
  Divider,
} from '@/pages/board/styles/postDetailStyles';
import HomeIconMenu from '@/components/HomeIconMenu';
import Header from '@/pages/board/components/BoardHeader';
import ActionSheet from '@/pages/board/components/ActionSheet';
import Modal from '@/pages/board/components/Modal';
import useModal from '@/pages/board/hooks/useModal';
import usePosts from '@/pages/board/hooks/usePosts';
import LikePink from '@/pages/board/components/Icons/LikePink.svg';
import Like from '@/pages/board/components/Icons/Like.svg';
import Comment from '@/pages/board/components/Icons/Comment.svg';
import Edit from '@/pages/board/components/Icons/Edit.svg';
import Delete from '@/pages/board/components/Icons/Delete.svg';
import Tab from '@/pages/board/components/Icons/Tab.svg';
import Lock from '@/pages/board/components/Icons/Lock.svg';
import Dots from '@/pages/board/components/Icons/Dots.svg';
import useResponsive from '@/pages/board/hooks/useResponsive';
import useAxios from '@/utils/hooks/useAxios';
import Footer from '@/components/Footer';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // useAxios 훅으로 토큰 관리 추가
  useAxios();
  const { 
    getPost, 
    getComments, 
    addComment,
    updateComment, 
    deletePost, 
    togglePostLike, 
    toggleCommentLike,
    deleteComment,
    isMyPost,
    isMyComment,
    currentUser
  } = usePosts();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const { isOpen: isActionSheetOpen, openModal: openActionSheet, closeModal: closeActionSheet } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [selectedComment, setSelectedComment] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [replyingToComment, setReplyingToComment] = useState(null); // PC 대댓글 작성창용
  const [replyText, setReplyText] = useState(''); // PC 대댓글 작성 텍스트


  const isPC = useResponsive();
  
  // 데이터 로드
  useEffect(() => {
    loadPostData();
  }, [id]);

  const loadPostData = async () => {
    setLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([
        getPost(id),
        getComments(id)
      ]);
      
      if (postData) {
        setPost(postData);
        setComments(commentsData);
      } else {
        navigate('/board');
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      navigate('/board');
    } finally {
      setLoading(false);
    }
  };

   // 스와이프 관련 함수들
  const minSwipeDistance = 50; // 최소 스와이프 거리

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (Array.isArray(post.image) && post.image.length > 1) {
      if (isLeftSwipe && currentImageIndex < post.image.length - 1) {
        // 왼쪽 스와이프: 다음 이미지
        setCurrentImageIndex(prev => prev + 1);
      }
      if (isRightSwipe && currentImageIndex > 0) {
        // 오른쪽 스와이프: 이전 이미지
        setCurrentImageIndex(prev => prev - 1);
      }
    }
  };

  // 댓글 정렬 함수 
  const sortCommentsWithReplies = (commentList) => {
    const result = [];
    
    const parentComments = commentList
      .filter(comment => comment.parentId === null)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    parentComments.forEach(parentComment => {
      result.push(parentComment);
      
      const getAllRelatedReplies = (rootId) => {
        const directReplies = commentList.filter(comment => comment.parentId === rootId);
        let allReplies = [...directReplies];
        
        directReplies.forEach(reply => {
          const subReplies = getAllRelatedReplies(reply.id);
          allReplies.push(...subReplies);
        });
        
        return allReplies;
      };
      
      const allReplies = getAllRelatedReplies(parentComment.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      result.push(...allReplies);
    });
    
    return result;
  };

  // 댓글 추가
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const newCommentData = {
        content: commentText,
        parentId: replyingTo ? replyingTo.id : null,
        replyLevel: replyingTo ? 1 : 0
      };

      const newComment = await addComment(post.id, newCommentData);
      
      // 댓글 목록 새로고침
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // PC 대댓글 작성 제출
  const handleReplySubmit = async (parentComment) => {
    if (!replyText.trim()) return;

    try {
      const newCommentData = {
        content: replyText,
        parentId: parentComment.id,
        replyLevel: 1
      };

      await addComment(post.id, newCommentData);
      
      // 댓글 목록 새로고침
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      
      // 작성창 닫기
      setReplyingToComment(null);
      setReplyText('');
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성에 실패했습니다.');
    }
  };

  // 게시글 좋아요 토글
  const handlePostLike = async () => {
    try {
      await togglePostLike(post.id);
      setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId) => {
    try {
      const result = await toggleCommentLike(post.id, commentId);
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: result.liked,
            likes: comment.likes + result.likeChange
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
    }
  };

  // 댓글 수정 시작
  const handleEditComment = (comment) => {
    setSelectedComment(comment);
    openEditModal();
  };

  // 댓글 수정 모드 진입
  const startEditingComment = (comment) => {
    setEditingComment(comment);
    setEditCommentText(comment.content);
    closeEditModal();
  };

  // 댓글 수정 취소
  const cancelEditingComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  // 댓글 수정 완료
  const handleCommentUpdate = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      await updateComment(post.id, commentId, { content: editCommentText });
      
      // 댓글 목록 새로고침
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      
      setEditingComment(null);
      setEditCommentText('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      // 대댓글이 있는 경우는 서버에서 처리
      await deleteComment(post.id, commentId);
      
      // 댓글 목록 새로고침
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
      
      closeDeleteModal();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 게시글 삭제
  const handlePostDelete = async () => {
    try {
      await deletePost(post.id);
      navigate('/board');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 대댓글 시작 (PC는 인라인 작성창, 모바일은 기존 방식)
  const handleReply = (comment) => {
    if (isPC) {
      // PC: 인라인 답글 작성창 열기
      setReplyingToComment(comment);
      setReplyText('');
    } else {
      // 모바일: 기존 방식 유지
      setReplyingTo(comment);
    }
  };

  // PC 답글 작성 취소
  const handleCancelReply = () => {
    setReplyingToComment(null);
    setReplyText('');
  };

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          로딩 중...
        </div>
      </Container>
    );
  }

  if (!post) return null;

  const isPostOwner = isMyPost(post);

  // 게시글 옵션 액션시트
  const postActions = [
    {
      icon: <img src={Edit} alt="수정" width="20" height="20" />,
      label: '수정하기',
      type: 'edit',
      onClick: () => navigate(`/board/edit/${id}`)
    },
    {
      icon: <img src={Delete} alt="삭제" width="20" height="20" />,
      label: '삭제하기',
      type: 'delete',
      onClick: () => {
        closeActionSheet();
        openDeleteModal();
      }
    }
  ];

  // 모달 액션
  const deleteModalActions = [
    {
      label: '취소',
      type: 'cancel',
      onClick: closeDeleteModal
    },
    {
      label: '삭제',
      type: 'confirm',
      onClick: () => {
        if (selectedComment) {
          handleCommentDelete(selectedComment.id);
        } else {
          handlePostDelete();
        }
      }
    }
  ];

  const editModalActions = [
    {
      label: '취소',
      type: 'cancel',
      onClick: closeEditModal
    },
    {
      label: '수정',
      type: 'confirm',
      onClick: () => {
        if (selectedComment) {
          startEditingComment(selectedComment);
        }
      }
    }
  ];

  const sortedComments = sortCommentsWithReplies(comments);

  return (
    <Container>
      {!isPC && (
        <Header
          title={post.category}
          showBack={true}
          myPost={isPostOwner ? openActionSheet : undefined}
        />
      )}

      <SideMenuWrapper>
        <HomeIconMenu isWeb={true} selectedMenu="board" />
      </SideMenuWrapper>

      <ContentArea>
        <PostDetailContainer>
          {/* 게시글 헤더 */}
          <PostHeader>
            {isPC && ( 
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                  <PostTitle>{post.title}</PostTitle>
                  <div style={{marginBottom: '12px', fontSize: '16px', fontWeight: 'bold', color: '#F67676'}}>
                    {post.category === 'general' ? '일반' : '홍보' }
                  </div>
                </div>
                <HeaderIcons>
                  {isPostOwner ? (
                    <HeaderIcon onClick={openActionSheet} src={Dots} />
                  ) : (
                    <EmptyHeaderIcon />
                  )}
                </HeaderIcons>
              </div>
            )}
            <PostMeta>
              <PostAuthor>{post.author}</PostAuthor>
              <PostDate>{post.date}</PostDate>
            </PostMeta>
            {!isPC && ( <PostTitle>{post.title}</PostTitle> )}
          </PostHeader>

          {/* 게시글 내용 */}
          <PostContent>{post.content}</PostContent>

          {/* 게시글 이미지 */}
          {post.image && post.image.length > 0 && (
            <ImageContainer>
              {/* 모바일: 페이지네이션 + 스와이프 */}
              {!isPC && (
                <>
                  <div
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{ position: 'relative' }}
                  >
                    <PostImage 
                      src={Array.isArray(post.image) ? post.image[currentImageIndex] : post.image} 
                      alt="게시글 이미지"
                      style={{ 
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        touchAction: 'pan-y' // 가로 스와이프만 감지
                      }}
                    />
                    

                  </div>
                  
                  {Array.isArray(post.image) && post.image.length > 1 && (
                    <ImagePagination>
                      {post.image.map((_, index) => (
                        <PaginationDot
                          key={index}
                          active={index === currentImageIndex}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </ImagePagination>
                  )}
                </>
              )}
              
              {/* PC: 모든 이미지 한번에 렌더링 */}
              {isPC && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Array.isArray(post.image) ? (
                    post.image.map((imageUrl, index) => (
                      <PostImage 
                        key={index}
                        src={imageUrl} 
                        alt={`게시글 이미지 ${index + 1}`} 
                      />
                    ))
                  ) : (
                    <PostImage src={post.image} alt="게시글 이미지" />
                  )}
                </div>
              )}
            </ImageContainer>
          )}

          {/* 게시글 좋아요 */}
          {!isPC && (
          <PostActions>
            <LikeButton liked={post.isLiked} onClick={handlePostLike}>
              <LikeIcon src={LikePink} alt="좋아요" />
              좋아요
            </LikeButton>
          </PostActions>
          )}

          <Divider />

          {/* 댓글 섹션 */}
          <CommentsSection>
            <CommentsSectionTitle>댓글 {comments.length}개</CommentsSectionTitle>

            {/* PC 댓글 입력 (상단 고정) */}
            {isPC && (
              <CommentInputContainer>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}> 
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', height: '67%', 
                    padding: '20px 16px 8px 16px', gap: '10px', borderBottom: '1px solid #DDDDDD'
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500', padding: '4px 0px' }}>
                        {currentUser?.name || '익명'}
                      </div>
                    </div>
                    <CommentInput
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit();
                        }
                      }}
                    />
                  </div>
                  <div style={{ 
                    display: 'flex', flexDirection: 'row', height: '33%', justifyContent: 'space-between', 
                    padding: '16px 20px', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <img src={Lock} alt="lock" width="24" height="24" />
                      <div style={{ fontSize: '16px', fontWeight: '500', color: '#929292' }}>익명</div>
                    </div>
                    <CommentSubmitButton onClick={handleCommentSubmit}>
                      등록
                    </CommentSubmitButton>
                  </div>
                </div>
              </CommentInputContainer>
            )}
            
            {/* 개별 댓글 */}
            {(() => {
              // 부모 댓글만 추출
              const parentComments = sortedComments.filter(c => c.parentId === null);
              
              return parentComments.map((parentComment) => {
                // 이 부모 댓글의 모든 대댓글 추출
                const replies = sortedComments.filter(c => c.parentId === parentComment.id);
                // 현재 이 부모 댓글에 답글 작성창이 열려있는지
                const isReplyingToThis = replyingToComment?.id === parentComment.id;
                
                return (
                  <React.Fragment key={parentComment.id}>
                    {/* 부모 댓글 */}
                    <CommentItem replyLevel={0}>
                      <div>
                        {/* 삭제된 댓글 표시 처리 */}
                        {parentComment.isDeleted ? (
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
                                  {isMyPost(post) && parentComment.userId === post.userId ? '작성자' : parentComment.author}
                                </CommentAuthor>
                                <CommentDate>{parentComment.date}</CommentDate>
                              </div>
                              
                              <CommentHeaderActions>
                                {!isMyComment(parentComment) && (
                                  <CommentButton onClick={() => handleCommentLike(parentComment.id)}>
                                    <CommentIcon 
                                      src={parentComment.isLiked ? LikePink : Like} 
                                      alt="좋아요" 
                                    />
                                  </CommentButton>
                                )}
                                
                                {/* 대댓글 버튼 - 부모 댓글에만 표시 */}
                                <CommentButton onClick={() => handleReply(parentComment)}>
                                  <CommentIcon src={Comment} alt="대댓글" />
                                </CommentButton>

                                {isMyComment(parentComment) && (
                                  <>
                                    <CommentActionButton onClick={() => handleEditComment(parentComment)}>
                                      수정
                                    </CommentActionButton>
                                    <CommentActionButton 
                                      onClick={() => {
                                        setSelectedComment(parentComment);
                                        openDeleteModal();
                                      }}
                                      className="delete"
                                    >
                                      삭제
                                    </CommentActionButton>
                                  </>
                                )}
                              </CommentHeaderActions>
                            </CommentHeader>
                            
                            {/* 수정 중인 댓글은 입력창으로, 아니면 일반 텍스트로 표시 */}
                            {editingComment && editingComment.id === parentComment.id ? (
                              <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                                <CommentInput
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleCommentUpdate(parentComment.id);
                                    }
                                  }}
                                  style={{ 
                                    height: isPC ? '80px' : '60px',
                                    marginBottom: '8px',
                                    width: '90%',
                                    border: '1px solid #DDDDDD',
                                    borderRadius: '5px',
                                    padding: '6px'
                                  }}
                                />
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <CommentActionButton onClick={cancelEditingComment}>
                                    취소
                                  </CommentActionButton>
                                  <CommentActionButton 
                                    onClick={() => handleCommentUpdate(parentComment.id)}
                                    style={{ color: '#F67676' }}
                                  >
                                    완료
                                  </CommentActionButton>
                                </div>
                              </div>
                            ) : (
                              <CommentContent>{parentComment.content}</CommentContent>
                            )}
                            
                            {parentComment.likes > 0 && (
                              <CommentLikeInfo>
                                <img src={isPC ? Like : LikePink } alt="좋아요" width={isPC ? '28px' : '20px' } height={isPC ? '28px' : '20px' } />
                                <span>{parentComment.likes}</span>
                              </CommentLikeInfo>
                            )}
                          </>
                        )}
                      </div>
                    </CommentItem>

                    {/* 이 부모 댓글의 모든 대댓글들 */}
                    {replies.map((reply) => (
                      <CommentItem key={reply.id} replyLevel={1}>
                        <ReplyIndicator>
                          {!isPC && ( <img src={Tab} alt="대댓글" width="20" height="20" /> )}
                          {isPC && ( <img src={Tab} alt="대댓글" width="24" height="24" /> )}
                        </ReplyIndicator>
                        <div>
                          {/* 삭제된 댓글 표시 처리 */}
                          {reply.isDeleted ? (
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
                                    {isMyPost(post) && reply.userId === post.userId ? '작성자' : reply.author}
                                  </CommentAuthor>
                                  <CommentDate>{reply.date}</CommentDate>
                                </div>
                                
                                <CommentHeaderActions>
                                  {!isMyComment(reply) && (
                                    <CommentButton onClick={() => handleCommentLike(reply.id)}>
                                      <CommentIcon 
                                        src={reply.isLiked ? LikePink : Like} 
                                        alt="좋아요" 
                                      />
                                    </CommentButton>
                                  )}
                                  
                                  {/* 대댓글에는 대댓글 버튼 표시 안 함 (대댓글 레벨 1) */}

                                  {isMyComment(reply) && (
                                    <>
                                      <CommentActionButton onClick={() => handleEditComment(reply)}>
                                        수정
                                      </CommentActionButton>
                                      <CommentActionButton 
                                        onClick={() => {
                                          setSelectedComment(reply);
                                          openDeleteModal();
                                        }}
                                        className="delete"
                                      >
                                        삭제
                                      </CommentActionButton>
                                    </>
                                  )}
                                </CommentHeaderActions>
                              </CommentHeader>
                              
                              {/* 수정 중인 댓글은 입력창으로, 아니면 일반 텍스트로 표시 */}
                              {editingComment && editingComment.id === reply.id ? (
                                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                                  <CommentInput
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCommentUpdate(reply.id);
                                      }
                                    }}
                                    style={{ 
                                      height: isPC ? '80px' : '60px',
                                      marginBottom: '8px',
                                      width: '90%',
                                      border: '1px solid #DDDDDD',
                                      borderRadius: '5px',
                                      padding: '6px'
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <CommentActionButton onClick={cancelEditingComment}>
                                      취소
                                    </CommentActionButton>
                                    <CommentActionButton 
                                      onClick={() => handleCommentUpdate(reply.id)}
                                      style={{ color: '#F67676' }}
                                    >
                                      완료
                                    </CommentActionButton>
                                  </div>
                                </div>
                              ) : (
                                <CommentContent>{reply.content}</CommentContent>
                              )}
                              
                              {reply.likes > 0 && (
                                <CommentLikeInfo>
                                  <img src={isPC ? Like : LikePink } alt="좋아요" width={isPC ? '28px' : '20px' } height={isPC ? '28px' : '20px' } />
                                  <span>{reply.likes}</span>
                                </CommentLikeInfo>
                              )}
                            </>
                          )}
                        </div>
                      </CommentItem>
                    ))}

                    {/* PC: 이 부모 댓글의 모든 대댓글이 끝난 후, 답글 작성창 표시 */}
                    {isPC && isReplyingToThis && (
                      <div style={{ position: 'relative', paddingLeft: '28px', marginTop: '20px', marginBottom: '20px' }}>
                        <ReplyIndicator style={{ position: 'absolute', left: '0', top: '20px' }}>
                          <img src={Tab} alt="대댓글" width="24" height="24" />
                        </ReplyIndicator>
                        
                        <CommentInputContainer style={{ position: 'relative' }}>
                          {/* X 버튼 */}
                          <button
                            onClick={handleCancelReply}
                            style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              background: 'none',
                              border: 'none',
                              fontSize: '20px',
                              color: '#929292',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              lineHeight: '1',
                              zIndex: 10
                            }}
                          >
                            ✕
                          </button>

                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}> 
                            <div style={{ 
                              display: 'flex', flexDirection: 'column', height: '67%', 
                              padding: '20px 16px 8px 16px', gap: '10px', borderBottom: '1px solid #DDDDDD'
                            }}>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '16px', fontWeight: '500', padding: '4px 0px' }}>
                                  {currentUser?.name || '익명'}
                                </div>
                              </div>
                              <CommentInput
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="댓글을 입력하세요..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReplySubmit(parentComment);
                                  }
                                }}
                              />
                            </div>
                            <div style={{ 
                              display: 'flex', flexDirection: 'row', height: '33%', justifyContent: 'space-between', 
                              padding: '16px 20px', alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <img src={Lock} alt="lock" width="24" height="24" />
                                <div style={{ fontSize: '16px', fontWeight: '500', color: '#929292' }}>익명</div>
                              </div>
                              <CommentSubmitButton onClick={() => handleReplySubmit(parentComment)}>
                                등록
                              </CommentSubmitButton>
                            </div>
                          </div>
                        </CommentInputContainer>
                      </div>
                    )}
                  </React.Fragment>
                );
              });
            })()}
          </CommentsSection>
        </PostDetailContainer>
        {!isPC && (
          <div style={{margin: '100px 0px 0px 0px'}}><Footer /></div>
        )}
      </ContentArea>

      {/* 모바일 댓글 입력 */}
      {!isPC && (
      <CommentInputContainer>
        {replyingTo && (
          <div style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginBottom: '8px',
            padding: '4px 8px',
            background: '#f5f5f5',
            borderRadius: '4px'
          }}>
            {replyingTo.author}님에게 답글 작성 중
            <button 
              onClick={() => setReplyingTo(null)}
              style={{ 
                marginLeft: '8px', 
                background: 'none', 
                border: 'none', 
                color: '#999',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <CommentInput
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          <CommentSubmitButton onClick={handleCommentSubmit}>
            등록
          </CommentSubmitButton>
        </div>
      </CommentInputContainer>
      )}

      {/* 액션시트 */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={closeActionSheet}
        title="게시글"
        actions={postActions} 
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={selectedComment ? "댓글을 삭제하시겠어요?" : "게시글을 삭제하시겠어요?"}
        actions={deleteModalActions}
      />

      {/* 수정 확인 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="댓글을 수정하시겠어요?"
        actions={editModalActions}
      />
      {isPC && (
        <div style={{margin: '300px 0px 0px 0px'}}><Footer /></div>
      )}
    </Container>
  );
};

export default PostDetailPage;