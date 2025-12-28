
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchAPI } from '@/pages/search/api/searchApi';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useAxios from '@/utils/hooks/useAxios';
import ChevronPink from '@/assets/icons/chevronLeft.svg';
import ClosePink from '@/assets/icons/ClosePink.svg';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 20;

const SearchMobile = () => {
  const navigate = useNavigate();
  
  // localStorage에서 최근 검색어 불러오기
  const loadRecentSearches = () => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('최근 검색어 불러오기 실패:', error);
      return [];
    }
  };

  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const scrollRef = useRef(null);

  // useCustomFetch 훅 사용
  const { fetchData } = useCustomFetch();
  
  // useAxios 훅으로 토큰 관리
  useAxios();

  // 컴포넌트 마운트 시 임박한 공연 데이터 로드
  useEffect(() => {
    const fetchUpcomingShows = async () => {
      try {
        setIsInitialLoading(true);
        const response = await searchAPI.getShowIncoming(fetchData);
        const showData = response.data.isSuccess ? response.data.result : response.data;
        
        if (showData && Array.isArray(showData)) {
          // API 응답을 임박한 공연 형태로 변환 (상위 4개만)
          const formattedShows = showData.slice(0, 4).map((show, index) => ({
            id: show.amateurShowId,
            rank: index + 1,
            title: show.name,
            venue: show.detailAddress,
            date: show.schedule,
            posterImageUrl: show.posterImageUrl
          }));
          setUpcomingShows(formattedShows);
        }
      } catch (error) {
        console.error('임박한 공연 데이터 로드 실패:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchUpcomingShows();
  }, []);

  // localStorage에 최근 검색어 저장
  const saveRecentSearches = (searches) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('최근 검색어 저장 실패:', error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const removeRecentSearch = (index) => {
    setRecentSearches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    saveRecentSearches([]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const performSearch = async (keyword) => {
    if (!keyword.trim()) return;

    try {
      setIsLoading(true);
      const response = await searchAPI.searchShows(fetchData, keyword.trim());
      const searchData = response.data.isSuccess ? response.data.result : response.data;
      
      if (searchData && searchData.content && Array.isArray(searchData.content)) {
        // API 응답을 기존 형태로 변환
        const formattedResults = searchData.content.map(item => ({
          id: item.showId,
          title: item.title,
          company: item.performerName,
          venue: item.hallName,
          date: item.schedule,
          status: getStatusText(item.status),
          isActive: item.status === 'ONGOING',
          posterImageUrl: item.posterImageUrl
        }));
        
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      addToRecentSearches(searchTerm.trim());
      performSearch(searchTerm.trim());
    }
  };

  const addToRecentSearches = (newSearch) => {
    if (newSearch) {
      setRecentSearches(prev => {
        const filteredSearches = prev.filter(search => search !== newSearch);
        const updated = [newSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
        saveRecentSearches(updated);
        return updated;
      });
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    performSearch(search);
  };

  // API 상태 텍스트 변환 함수
  const getStatusText = (status) => {
    const statusMap = {
      'ONGOING': '판매중',
      'YET': '판매예정',
      'ENDED': '공연종료',
      'WAITING_APPROVAL': '승인대기',
      'REJECTED': '반려'
    };
    return statusMap[status] || '정보없음';
  };

  const displayResults = hasSearched ? searchResults : [];

  return (
    <AppContainer>
      <SearchBar>
        <BackButton src={ChevronPink} onClick={handleBackClick} />
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="보고싶은 연극이나 공연진을 검색하세요."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </SearchBox>
      </SearchBar>

      {!hasSearched && !searchTerm.trim() ? (
        <>
          {/* 최근검색어 */}
          <RecentSearchSection>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <SectionTitle>최근 검색어</SectionTitle>
              {recentSearches.length > 0 && (
                <ClearAllButton onClick={clearAllSearches}>
                  전체 삭제
                </ClearAllButton>
              )}
            </div>
            {recentSearches.length > 0 ? (
              <RecentSearches>
                {recentSearches.map((search, index) => (
                  <RecentSearchBox key={index} onClick={() => handleRecentSearchClick(search)}>
                    {search}
                    <DeleteButton 
                      src={ClosePink} 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(index);
                      }}
                    />
                  </RecentSearchBox>
                ))}
              </RecentSearches>
            ) : (
              <NoRecentSearches>최근 검색어가 없습니다.</NoRecentSearches>
            )}
            <Divider/>
          </RecentSearchSection>

          {/* 임박한 공연 */}
          <UpcomingSection>
            <SectionTitle>임박한 공연</SectionTitle>
            {isInitialLoading ? (
              <LoadingMessage>임박한 공연을 불러오는 중...</LoadingMessage>
            ) : upcomingShows.length > 0 ? (
              <SlideContainer ref={scrollRef}>
                <SlideContent>
                  {upcomingShows.map((performance) => (
                    <PerformanceCard key={performance.id} onClick={() => navigate(`/plays/detail/${performance.id}`)}>
                      <PerformanceImage>
                        <img 
                          src={performance.posterImageUrl} 
                          style={{width: '100%', height: '100%', borderRadius: '3px'}}
                        />
                        <PerformanceNumber>{performance.rank}</PerformanceNumber>
                      </PerformanceImage>
                      <PerformanceInfo>
                        <PerformanceTitle>{performance.title}</PerformanceTitle>
                        <PerformanceVenue>{performance.venue}</PerformanceVenue>
                        <PerformanceDate>{performance.date}</PerformanceDate>
                      </PerformanceInfo>
                    </PerformanceCard>
                  ))}
                </SlideContent>
              </SlideContainer>
            ) : (
              <NoDataMessage>임박한 공연이 없습니다.</NoDataMessage>
            )}
          </UpcomingSection>
        </>
      ) : (
        <SearchResults>
          <div style={{color: '#929292', fontSize: '12px', marginBottom: '20px' }}>
            {isLoading ? '검색 중...' : `검색 결과 ${displayResults.length}개`}
          </div>
          
          {isLoading ? (
            <LoadingMessage>검색 중...</LoadingMessage>
          ) : displayResults.length > 0 ? (
            displayResults.map((result) => (
              <SearchResultItem key={result.id} onClick={() => navigate(`/plays/detail/${result.id}`)}>
                <ResultImage>
                  <img 
                    src={result.posterImageUrl} 
                    style={{width: '100%', height: '100%', borderRadius: '3px'}}
                  />
                </ResultImage>
                <ResultInfo>
                  <ResultStatus $isActive={result.isActive}>{result.status}</ResultStatus>
                  <ResultTitle>{result.title}</ResultTitle>
                  <ResultCompany>{result.company}</ResultCompany>
                  <ResultDetails>
                    {result.venue}
                    <div style={{height: '6px'}}/>
                    {result.date}
                  </ResultDetails>
                </ResultInfo>
              </SearchResultItem>
            ))
          ) : hasSearched ? ( 
            <NoResultsMessage>
              <div>검색 결과가 없습니다.</div>
              <div>다른 검색어로 시도해보세요.</div>
            </NoResultsMessage>
          ) : (
            <NoResultsMessage>
              <div>보고싶은 연극이나 공연진을 검색하세요.</div>
            </NoResultsMessage>
          )}
        </SearchResults>
      )}
    </AppContainer>
  );
};

export default SearchMobile;

const AppContainer = styled.div`
  height: 100vh;
  margin: 0 auto;
  padding: 0px 20px;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 상단 검색바 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const SearchBar = styled.div`
  height: 72px;
  display: flex;
  flex-direction: row;
  gap: 17px;
  justify-content: space-between;
  padding: 30px 0px 18px 0px;
`;

const BackButton = styled.img`
  width: 7px;
  height: 15px;
  cursor: pointer;
  margin-top: 5px;
  margin-left: 8px;
`;

const SearchBox = styled.div`
  width: 100%;
  height: 24px;
  padding: 2px 0px 4px 0px;
  display: flex;
  border-bottom: 1px solid #DDDDDD;
`;

const SearchInput = styled.input`
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  border: none;
  outline: none;

  &::placeholder {
    color: #929292;
  }
`;

// 최근 검색어 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const RecentSearchSection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #929292;
  font-size: 12px;
  cursor: pointer;
`;

const RecentSearches = styled.div`
  margin: 20px 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const RecentSearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #FFF1EF;
  border-radius: 30px;
  padding: 8px 12px;
  color: #F67676;
  font-size: 12px;
  font-weight: 500;
  gap: 12px;
  cursor: pointer;
`;

const DeleteButton = styled.img`
  cursor: pointer;
  width: 8px;
  height: 8px;
`;

const NoRecentSearches = styled.div`
  margin: 20px 0px;
  text-align: center;
  color: #929292;
  font-size: 12px;
`;

const Divider = styled.div`
  height: 2px;
  background-color: #FFF1EF;
  width: calc(100% + 40px);
  margin-left: -20px;
`;

// 임박한 공연 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const UpcomingSection = styled.div`
  margin-top: 32px;
`;

const SlideContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SlideContent = styled.div`
  display: flex;
  gap: 20px;
`;

const PerformanceCard = styled.div`
  flex: 0 0 128px;
  overflow: hidden;
`;

const PerformanceImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
`;

const PerformanceNumber = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 800;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
`;

const PerformanceInfo = styled.div`
  margin-top: 12px;
`;

const PerformanceTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const PerformanceVenue = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 4px;
`;

const PerformanceDate = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #929292;
`;

// 검색결과 영역  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const SearchResults = styled.div`
  margin-top: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SearchResultItem = styled.div`
  margin-bottom: 32px;
  display: flex;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultImage = styled.div`
  width: 112px;
  height: 156px;
  margin-right: 20px;
  flex-shrink: 0;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultStatus = styled.div`
  width: ${props => props.$isActive ? '43px' : '52px'};
  padding: 4px 8px;
  border-radius: 3px;
  color: ${props => props.$isActive ? '#F67676' : '#929292'};
  background: ${props => props.$isActive ? '#FFF1EF' : '#F8F8F8'};
  font-size: 10px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const ResultTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 10px;
`;

const ResultCompany = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 14px;
`;

const ResultDetails = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #929292;
`;

// 로딩 및 빈 상태 메시지
const LoadingMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #929292;
  font-size: 14px;
`;

const NoDataMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #929292;
  font-size: 14px;
`;

const NoResultsMessage = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #929292;
  font-size: 14px;
  
  div + div {
    margin-top: 8px;
  }
`;
