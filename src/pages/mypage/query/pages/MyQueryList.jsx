import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '@/components/TopBar';
import TopBarWeb from '@/components/TopBarWeb';
import Footer from '@/components/Footer';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useResponsive from '@/pages/board/hooks/useResponsive';

const MyQueryList = () => {
  const navigate = useNavigate();
  const isPC = useResponsive();
  const { fetchData } = useCustomFetch();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      setLoading(true);
      const response = await fetchData('/inquirys?page=0&size=20', 'GET');
      const queryList = response?.data?.result?.inquiryList || response?.result?.inquiryList || [];
      setQueries(queryList);
    } catch (error) {
      console.error('문의 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryClick = (queryId) => {
    navigate(`/mypage/query/${queryId}`);
  };

  const handleCreateClick = () => {
    navigate('/mypage/query/create');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace(/\.$/, '');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'RECEIVED':
        return '답변 대기';
      case 'REPLIED':
        return '답변 완료';
      default:
        return '답변 대기';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REPLIED':
        return '#FFBEBB';
      case 'RECEIVED':
      default:
        return '#FFBEBB';
    }
  };

  return (
    <MyQueryListWrapper>
      {/* 모바일 상단바 */}
      <div className="only-mobile">
        <TopBar onPrev={() => navigate(-1)}>1:1 문의</TopBar>
      </div>
      
      {/* 웹 상단바 */}
      <div className="only-web-flex">
        <TopBarWeb>1:1 문의</TopBarWeb>
      </div>

      <Wrapper>
        {/* 문의하기 버튼 */}
        <HeaderSection>
          <h1></h1>
          <CreateButton onClick={handleCreateClick}>문의하기</CreateButton>
        </HeaderSection>

        {/* PC 버전 */}
        {isPC && (
          <PCTable>
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
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
              ) : queries.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                    문의 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                queries.map((query) => (
                  <tr key={query.inquiryId} onClick={() => handleQueryClick(query.inquiryId)}>
                    <td className="title">{query.inquiryTitle}</td>
                    <td className="status">
                      <StatusBadge color={getStatusColor(query.inquiryStatus)}>
                        {getStatusText(query.inquiryStatus)}
                      </StatusBadge>
                    </td>
                    <td className="date">{formatDate(query.createTime)}</td>
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
            ) : queries.length === 0 ? (
              <EmptyState>문의 내역이 없습니다.</EmptyState>
            ) : (
              queries.map((query) => (
                <QueryCard key={query.inquiryId} onClick={() => handleQueryClick(query.inquiryId)}>
                  <QueryHeader>
                    <QueryTitle>{query.inquiryTitle}</QueryTitle>
                    <StatusBadge color={getStatusColor(query.inquiryStatus)}>
                      {getStatusText(query.inquiryStatus)}
                    </StatusBadge>
                  </QueryHeader>
                  <QueryDate>{formatDate(query.createTime)}</QueryDate>
                </QueryCard>
              ))
            )}
          </MobileList>
        )}
      </Wrapper>
      {isPC && (
        <div style={{margin: '0px -70px -100px -70px'}}><Footer /></div>
      )}
      {!isPC && (
        <div style={{margin: '0px 0px 0px 0px'}}><Footer /></div>
      )}
    </MyQueryListWrapper>
  );
};

export default MyQueryList;

// Styled Components
const MyQueryListWrapper = styled.div`
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
    padding: 30px 110px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -30px;
  margin-bottom: 24px;

  h1 {
    font-size: ${({ theme }) => theme.font.fontSize.headline24};
    font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
    color: ${({ theme }) => theme.colors.grayMain};
    
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.font.fontSize.title16};
    }
  }
`;

const CreateButton = styled.button`
  padding: 4px 16px;
  background: ${({ theme }) => theme.colors.pink600};
  color: white;
  border: none;
  border-radius: 3px;
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.pink700 || '#e55f5f'};
  }

  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: ${({ theme }) => theme.font.fontSize.body12};
  }
`;

const PCTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${({ theme }) => theme.colors.gray200};
    
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
      border-bottom: 1px solid #E6E6E6;
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
          // font-weight: ${({ theme }) => theme.font.fontWeight.bold};
        }

        &.status {
          
        }

        &.date {
          
        }
      }
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid ${props => props.color};
  color: black;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.font.fontSize.body10};

  @media (min-width: 768px) {
    background: white;
    border: none;
    font-size: ${({ theme }) => theme.font.fontSize.body14};
  }
`;

const MobileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QueryCard = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.grayWhite};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const QueryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
`;

const QueryTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayMain};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QueryDate = styled.span`
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  color: ${({ theme }) => theme.colors.gray400};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
`;
