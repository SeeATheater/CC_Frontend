
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchAPI } from '@/pages/search/api/searchApi';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useAxios from '@/utils/hooks/useAxios';
import ClosePinkBig from '@/assets/icons/ClosePinkBig.svg';
import SearchIcon from '@/assets/icons/searchGrey.svg?react';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 20;

const SearchPC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  const searchRef = useRef(null);
  const inputRef = useRef(null);

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
            rank: index + 1,  // 임시
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

  const handleInputFocus = () => {
    setIsExpanded(true);
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

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 검색창이 확장될 때 input에 포커스
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  return (
    <SearchContainer ref={searchRef}>

      {isExpanded && <Backdrop onClick={() => setIsExpanded(false)} />}

      <SearchWrapper $isExpanded={isExpanded}>
        <IconWrapper>
          <SearchIcon height={24} />
        </IconWrapper>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="보고 싶은 연극이나 공연진을 입력하세요."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          $isExpanded={isExpanded}
        />
      </SearchWrapper>

      {isExpanded && (
        <SearchDropdown>
          {!hasSearched && !searchTerm.trim() ? (
            <>
              {/* 최근검색어 */}
              <RecentSearchSection>
                <SectionHeader>
                  <SectionTitle>최근 검색어</SectionTitle>
                  {recentSearches.length > 0 && (
                    <ClearAllButton onClick={clearAllSearches}>
                      전체삭제
                    </ClearAllButton>
                  )}
                </SectionHeader>
                {recentSearches.length > 0 ? (
                  <RecentSearches>
                    {recentSearches.map((search, index) => (
                      <RecentSearchTag key={index} onClick={() => handleRecentSearchClick(search)}>
                        {search}
                        <DeleteButton 
                          src={ClosePinkBig} 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(index);
                          }}
                        />
                      </RecentSearchTag>
                    ))}
                  </RecentSearches>
                ) : (
                  <NoRecentSearches>최근 검색어가 없습니다.</NoRecentSearches>
                )}
              </RecentSearchSection>

              {/* 임박한 공연 */}
              <UpcomingSection>
                <SectionTitle>임박한 공연</SectionTitle>
                {isInitialLoading ? (
                  <LoadingMessage>임박한 공연을 불러오는 중...</LoadingMessage>
                ) : upcomingShows.length > 0 ? (
                  <UpcomingPerformances>
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
                  </UpcomingPerformances>
                ) : (
                  <NoDataMessage>임박한 공연이 없습니다.</NoDataMessage>
                )}
              </UpcomingSection>
            </>
          ) : (
            <SearchResults>
              <SearchResultsHeader>
                {isLoading ? '검색 중...' : `검색 결과 ${displayResults.length}개`}
              </SearchResultsHeader>
              
              {isLoading ? (
                <LoadingMessage>검색 중...</LoadingMessage>
              ) : displayResults.length > 0 ? (
                <SearchResultsList>
                  {displayResults.map((result) => (
                    <SearchResultItem key={result.id} onClick={() => navigate(`/plays/detail/${result.id}`)}>
                      <ResultImage>
                        <img 
                          src={result.posterImageUrl} 
                          style={{width: '100%', height: '100%'}}
                        />
                      </ResultImage>
                      <ResultInfo>
                        <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
                          <ResultTitle>{result.title}</ResultTitle>
                          <ResultStatus $isActive={result.isActive}>{result.status}</ResultStatus>
                        </div>
                        <ResultCompany>{result.company}</ResultCompany>
                        <ResultDetails>
                          <div style={{fontSize: '13px', color: '#000000'}}>{result.venue}</div>
                          <div style={{fontSize: '12px', color: '#929292'}}>{result.date}</div>
                        </ResultDetails>
                      </ResultInfo>
                    </SearchResultItem>
                  ))}
                </SearchResultsList>
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
        </SearchDropdown>
      )}

    </SearchContainer>
  );  
};

export default SearchPC;

const SearchContainer = styled.div`
	position: relative;
	width: 100%;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

// 상단 검색바 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  transition: all 0.2s ease;
  ${({ $isExpanded }) => $isExpanded && `
    border-radius: 5px 5px 0 0;
  `}
  z-index: 1000;
`;

const IconWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 12px;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
`;

const SearchInput = styled.input`
	width: 100%;
	background-color: ${({ $isExpanded }) => $isExpanded ? '#FFFFFF' : '#F8F8F8'};
	height: 40px;
	padding: 8px 20px 8px 40px;
	border-radius: ${({ $isExpanded }) => $isExpanded ? '5px 5px 0 0' : '5px'};
	border: none;
	font-size: ${({ theme }) => theme.font.fontSize.body13};
	color: #000000;
  outline: none;

  &::placeholder {
    color: #929292;
  }
`;

const SearchDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 5px 5px;
  z-index: 1000;
  height: 502px;
  overflow-y: auto;
  padding: 28px 24px;
  scrollbar-gutter: stable;
`;

// 최근 검색어 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const RecentSearchSection = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const ClearAllButton = styled.div`
  background: none;
  border: none;
  color: #929292;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
`;

const RecentSearches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const RecentSearchTag = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #F67676;
  border-radius: 30px;
  padding: 8px 12px;
  color: #F67676;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {  }
`;

const DeleteButton = styled.img`
  cursor: pointer;
  width: 12px;
  height: 12px;

  &:hover {  }
`;

const NoRecentSearches = styled.div`
  text-align: center;
  color: #929292;
  font-size: 14px;
  padding: 20px 0;
`;

// 임박한 공연 영역   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const UpcomingSection = styled.div`

`;

const UpcomingPerformances = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 47px;
`;

const PerformanceCard = styled.div`
  width: 128px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PerformanceImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
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
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const PerformanceVenue = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 2px;
`;

const PerformanceDate = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #929292;
`;

// 검색결과 영역  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const SearchResults = styled.div`
  
`;

const SearchResultsHeader = styled.div`
  color: #929292;
  font-size: 14px;
  margin-left: 4px;
  margin-bottom: 10px;
`;

const SearchResultsList = styled.div`
  
`;

const SearchResultItem = styled.div`
  margin-bottom: 28px;
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultImage = styled.div`
  width: 140px;
  height: 200px;
  margin-right: 28px;
  flex-shrink: 0;
  border-radius: 0px;
  overflow: hidden;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ResultStatus = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  color: ${props => props.$isActive ? '#F67676' : '#929292'};
  background: ${props => props.$isActive ? '#FFF1EF' : '#F8F8F8'};
  font-size: 10px;
  font-weight: 500;
  margin-bottom: 12px;
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
  margin-bottom: 18px;
`;

const ResultDetails = styled.div`
  font-weight: 500;
  
  div + div {
    margin-top: 4px;
  }
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
