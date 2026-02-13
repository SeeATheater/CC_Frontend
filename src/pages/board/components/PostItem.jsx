
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PostItem as StyledPostItem,
  PostTitle,
  PostContent,
  PostMeta,
  PostAuthor,
  PostDate,
  PostStats,
  PostStat,
  PostImage
} from '@/pages/board/styles/postStyles';
import Like from '@/pages/board/components/Icons/Like.svg';
import Comment from '@/pages/board/components/Icons/Comment.svg';
import useResponsive from '@/pages/board/hooks/useResponsive'
import { useAuth } from '@/context/AuthContext';

const PostItem = ({ post, isLast, lastElementRef }) => {
  const navigate = useNavigate();
const { isLoggedIn } = useAuth();
  const isPC = useResponsive();

  const handleClick = () => {
    // 로그인 체크 (프론트엔드 사전 차단)
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // 로그인 되어 있으면 상세 페이지로 이동
    navigate(`/board/post/${post.id}`);
  };

  return (
    <StyledPostItem 
      ref={isLast ? lastElementRef : null}
      onClick={handleClick}
    >
      <PostTitle>{post.title}</PostTitle>
      <PostContent>{post.content}</PostContent>

      <PostMeta>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <PostAuthor>{post.author}</PostAuthor>
          <PostDate>{post.date}</PostDate>
        </div>
        <PostStats>
          <PostStat>
            {!isPC && ( <img src={Like} alt="좋아요" width="20" height="20" /> )}
            {isPC && ( <img src={Like} alt="좋아요" width="28" height="28" /> )}
            <span>{post.likes}</span>
          </PostStat>
          <PostStat>
            {!isPC && ( <img src={Comment} alt="댓글" width="20" height="20" /> )}
            {isPC && ( <img src={Comment} alt="댓글" width="28" height="28" /> )}
            <span>{post.comments}</span>
          </PostStat>
        </PostStats>
      </PostMeta>
    </StyledPostItem>
  );
};

export default PostItem;