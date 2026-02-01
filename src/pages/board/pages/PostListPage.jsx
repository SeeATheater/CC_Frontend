
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  Container,
  ContentArea,
  LoadingSpinner,
  EmptyState,
  LoadMoreButton,
  LoadMoreContainer,
  SideMenuWrapper 
} from '@/pages/board/styles/commonStyles';
import FullScreenMenu from '@/components/FullScreenMenu';
import HomeIconMenu from '@/components/HomeIconMenu';
import Header from '@/pages/board/components/BoardHeader';
import TabBar from '@/pages/board/components/TabBar';
import SearchBar from '@/pages/board/components/SearchBar';
import PostItem from '@/pages/board/components/PostItem';
import FloatingButton from '@/pages/board/components/FloatingButton';
import usePosts from '@/pages/board/hooks/usePosts';
import useInfiniteScroll from '@/pages/board/hooks/useInfiniteScroll';
import useResponsive from '@/pages/board/hooks/useResponsive';
import useAxios from '@/utils/hooks/useAxios';
import Footer from '@/components/Footer';

const PostListPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const isPC = useResponsive();
  const contentAreaRef = useRef(null);
  const navigate = useNavigate();

  // useAxios 훅으로 토큰 관리
  useAxios();

  const {
    posts, 
    loading, 
    hasMore, 
    userType,
    canCreatePost, 
    loadPosts, 
    loadMore, 
    setPage, 
    searchPosts
  } = usePosts();

  const { lastElementRef } = useInfiniteScroll(
    () => loadMore(activeTab),
    hasMore,
    loading,
    !isPC && !isSearchMode // 모바일만 무한스크롤
  );

  // 초기 로드용 ref - 중복 로드 방지
  const initialLoadRef = useRef(false);

  // 컴포넌트 마운트 시 초기 데이터 로드 - 한 번만 실행
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      setPage(0);
      loadPosts(activeTab, 0, true);
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 탭 변경 시에만 데이터 로드
  const handleTabChange = (tab) => {
    if (tab !== activeTab) { // 같은 탭 클릭 시 중복 로드 방지
      setActiveTab(tab);
      setIsSearchMode(false);
      setSearchKeyword('');
      setSearchResults([]);
      
      // 스크롤 초기화
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
      
      // 탭 변경 시에만 새로운 데이터 로드
      setPage(0);
      loadPosts(tab, 0, true);
    }
  };

  // 검색 핸들러
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // 검색어가 비어있으면 검색 모드 해제하고 원래 목록 로드
      setIsSearchMode(false);
      setSearchKeyword('');
      setSearchResults([]);
      // 원래 게시글 목록 다시 로드
      setPage(0);
      loadPosts(activeTab, 0, true);
      return;
    }

    setSearchKeyword(searchTerm);
    setIsSearchMode(true);
    setSearchLoading(true);

    try {
      const results = await searchPosts(searchTerm, activeTab, 0, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색에 실패했습니다. 다시 시도해주세요.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // PC용 더보기 버튼 핸들러
  const handleLoadMore = () => {
    if (!isSearchMode && !loading) { // 로딩 중이 아닐 때만 실행
      loadMore(activeTab);
    }
  };

  // 표시할 게시글 목록 결정
  const displayPosts = isSearchMode ? searchResults : posts;
  const displayLoading = isSearchMode ? searchLoading : loading;
  const displayHasMore = isSearchMode ? false : hasMore;

  const showFloatingButton = activeTab === 'promotion' 
    ? canCreatePost(activeTab) // performer만
    : true; // 일반 게시판은 모두 표시

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (isMenuOpen) {
    return <FullScreenMenu onClose={() => setIsMenuOpen(false)} />;
  }

  return (
    <div>
      <SideMenuWrapper>
        <HomeIconMenu isWeb={true} selectedMenu="board" />
      </SideMenuWrapper>

      <Container>
        {!isPC && (
          <Header 
            title="board" 
            onMenuClick={() => setIsMenuOpen(true)}
            onSearchClick={() => navigate("/search")}
          />
        )}
        
        <TabBar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          showFloatingButton={showFloatingButton}
        />
        
        <SearchBar 
          onSearch={handleSearch} 
          showNotice={!isSearchMode}
        />

        {/* 검색 결과 표시 */}
        {isSearchMode && (
          <div style={{ 
            padding: isPC ? '0 100px 0 60px' : '0 20px', 
            marginBottom: '10px', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            {searchLoading ? (
              '검색 중...'
            ) : (
              `"${searchKeyword}" 검색 결과 ${searchResults.length}개`
            )}
            <button
              onClick={() => {
                setIsSearchMode(false);
                setSearchKeyword('');
                setSearchResults([]);
                setPage(0);
                loadPosts(activeTab, 0, true);
              }}
              style={{
                marginLeft: '10px',
                background: 'none',
                border: 'none',
                color: '#F67676',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              검색 취소
            </button>
          </div>
        )}
        
        <ContentArea ref={contentAreaRef}>
          {displayPosts.length === 0 && !displayLoading ? (
            <EmptyState>
              {isSearchMode ? (
                <>
                  <p>검색 결과가 없습니다.</p>
                  <p>다른 키워드로 검색해보세요.</p>
                </>
              ) : (
                <>
                  <p>게시글이 없습니다.</p>
                  <p>첫 게시글을 작성해보세요!</p>
                </>
              )}
            </EmptyState>
          ) : (
            <>
              {displayPosts.map((post, index) => (
                <PostItem
                  key={`${post.id}_${isSearchMode ? 'search' : 'normal'}`}
                  post={post}
                  isLast={index === displayPosts.length - 1}
                  lastElementRef={(!isPC && !isSearchMode) ? lastElementRef : null}
                />
              ))}

              {/* PC용 더보기 버튼 - 검색 모드가 아닐 때만 표시 */}
              {isPC && displayHasMore && !displayLoading && !isSearchMode && (
                <LoadMoreContainer>
                  <LoadMoreButton onClick={handleLoadMore}>
                    게시글 더보기
                  </LoadMoreButton>
                </LoadMoreContainer>
              )}
              
              {displayLoading && (
                <LoadingSpinner>
                  <p>{isSearchMode ? '검색 중...' : '로딩 중...'}</p>
                </LoadingSpinner>
              )}
            </>
          )}
          <Footer />
        </ContentArea>
        
        {!isPC && (
          <FloatingButton 
            show={showFloatingButton} 
            category={activeTab} 
          />
        )}
      </Container>
    </div>
  );
};

export default PostListPage;