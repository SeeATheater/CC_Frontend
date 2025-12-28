import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '@/components/TopBar';
import TopBarWeb from '@/components/TopBarWeb';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useResponsive from '@/pages/board/hooks/useResponsive';

const MyPost = () => {
  const navigate = useNavigate();
  const isPC = useResponsive();
  const { fetchData } = useCustomFetch();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      setLoading(true);
      // API 호출 - 내가 쓴 글 조회 (임시 api 가정)
      const response = await fetchData('/boards/my', 'GET');
      const myPosts = response?.data?.content || response?.result?.content || [];
      setPosts(myPosts);
    } catch (error) {
      console.error('내가 쓴 글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/board/post/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', '.');
  };

  return (
    <MyPostWrapper>
      {/* 모바일 상단바 */}
      <div className="only-mobile">
        <TopBar onPrev={() => navigate(-1)}>내가 쓴 글</TopBar>
      </div>
      
      {/* 웹 상단바 */}
      <div className="only-web-flex">
        <TopBarWeb>내가 쓴 글</TopBarWeb>
      </div>

      <Wrapper>
        {/* PC 버전 */}
        {isPC && (
          <PCTable>
            <thead>
              <tr>
                <th>제목</th>
                <th>게시판</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                    로딩 중...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                    작성한 글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.boardId} onClick={() => handlePostClick(post.boardId)}>
                    <td className="title">{post.title}</td>
                    <td className="board-type">
                      {post.boardType === 'NORMAL' ? '일반 게시판' : '홍보 게시판'}
                    </td>
                    <td className="date">{formatDate(post.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </PCTable>
        )}

        {/* 모바일 버전 */}
        {!isPC && (
          <MobileList>
            {loading ? (
              <EmptyState>로딩 중...</EmptyState>
            ) : posts.length === 0 ? (
              <EmptyState>작성한 글이 없습니다.</EmptyState>
            ) : (
              posts.map((post) => (
                <PostCard key={post.boardId} onClick={() => handlePostClick(post.boardId)}>
                  <PostHeader>
                    <PostCategory>
                      {post.boardType === 'NORMAL' ? '일반' : '홍보'}
                    </PostCategory>
                    <PostDate>{formatDate(post.createdAt)}</PostDate>
                  </PostHeader>
                  <PostTitle>{post.title}</PostTitle>
                  <PostContent>{post.content}</PostContent>
                  <PostMeta>
                    <MetaItem>
                      <span>👍</span>
                      <span>{post.likeCount || 0}</span>
                    </MetaItem>
                    <MetaItem>
                      <span>💬</span>
                      <span>{post.commentCount || 0}</span>
                    </MetaItem>
                  </PostMeta>
                </PostCard>
              ))
            )}
          </MobileList>
        )}
      </Wrapper>
    </MyPostWrapper>
  );
};

export default MyPost;

// Styled Components
const MyPostWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 100px 70px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 40px 100px;
  }
`;

const PCTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${({ theme }) => theme.colors.gray200};
    border-radius: 3px;
    
    tr th {
      padding: 12px 16px;
      // text-align: left;
      font-size: ${({ theme }) => theme.font.fontSize.body14};
      font-weight: ${({ theme }) => theme.font.fontWeight.bold};
      color: ${({ theme }) => theme.colors.gray500};
      
      &:nth-child(1) {
        width: 50%;
      }
      &:nth-child(2) {
        width: 25%;
      }
      &:nth-child(3) {
        width: 25%;
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${({ theme }) => theme.colors.grayWhite};
      }

      td {
        padding: 16px;
        font-size: ${({ theme }) => theme.font.fontSize.body14};
        color: ${({ theme }) => theme.colors.grayMain};
        text-align: center;

        &.title {
          
        }

        &.board-type {
          
        }

        &.date {
          
        }
      }
    }
  }
`;

const MobileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostCard = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.grayWhite};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PostCategory = styled.span`
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  color: ${({ theme }) => theme.colors.pink600};
  background: ${({ theme }) => theme.colors.pink100};
  padding: 4px 8px;
  border-radius: 4px;
`;

const PostDate = styled.span`
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  color: ${({ theme }) => theme.colors.gray400};
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
  color: ${({ theme }) => theme.colors.grayMain};
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PostContent = styled.p`
  font-size: ${({ theme }) => theme.font.fontSize.body13};
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  color: ${({ theme }) => theme.colors.gray400};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
`;
