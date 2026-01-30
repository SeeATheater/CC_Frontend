import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '@/components/TopBar';
import TopBarWeb from '@/components/TopBarWeb';
import Footer from '@/components/Footer';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useResponsive from '@/pages/board/hooks/useResponsive';

const QueryDetail = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const isPC = useResponsive();
  const { fetchData } = useCustomFetch();
  
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueryDetail();
  }, [queryId]);

  const loadQueryDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchData(`/inquirys/${queryId}`, 'GET');
      const queryData = response?.data?.result || response?.result;
      setQuery(queryData);
    } catch (error) {
      console.error('문의 상세 조회 실패:', error);
      alert('문의를 불러오는데 실패했습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', '.');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>로딩 중...</LoadingState>
      </Container>
    );
  }

  if (!query) {
    return (
      <Container>
        <LoadingState>문의를 찾을 수 없습니다.</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      {/* 모바일 상단바 */}
      {!isPC && (
        <TopBar onPrev={() => navigate(-1)}>1:1 문의</TopBar>
      )}
      
      {/* 웹 상단바 */}
      {isPC && (
        <div className="only-web-flex">
          <TopBarWeb>1:1 문의</TopBarWeb>
        </div>
      )}

      <ContentArea>
        <QueryDetailContainer>
          {/* 문의 헤더 */}
          <QueryHeader>
            {isPC && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '12px' }}>
                <QueryTitle>{query.inquiryTitle}</QueryTitle>
                <StatusBadge status={query.inquiryStatus}>
                  {query.inquiryStatus === 'REPLIED' ? '답변 완료' : '답변 대기'}
                </StatusBadge>
              </div>
            )}
            <QueryMeta>
              <QueryAuthor>{query.inquiryMemberName || '익명'}</QueryAuthor>
              <QueryDate>{formatDate(query.createTime)}</QueryDate>
            </QueryMeta>
            {!isPC && <QueryTitle>{query.inquiryTitle}</QueryTitle>}
          </QueryHeader>

          {/* 문의 내용 */}
          <QueryContent>{query.inquiryContent}</QueryContent>

          <Divider />

          {/* 답변 섹션 */}
          {query.inquiryReply && (
            <AnswerSection>
              <AnswerSectionTitle>답변 1개</AnswerSectionTitle>
              
              <AnswerItem>
                <AnswerHeader>
                  <AnswerAuthor>관리자</AnswerAuthor>
                  <AnswerDate>{formatDateTime(query.repliedAt)}</AnswerDate>
                </AnswerHeader>
                <AnswerContent>{query.inquiryReply}</AnswerContent>
              </AnswerItem>
            </AnswerSection>
          )}

          {!query.inquiryReply && (
            <NoAnswerSection>
              <p>아직 답변이 등록되지 않았습니다.</p>
              <p>빠른 시일 내에 답변 드리겠습니다.</p>
            </NoAnswerSection>
          )}
        </QueryDetailContainer>
      </ContentArea>
      {isPC && (
        <div style={{margin: '0px -70px -100px -70px'}}><Footer /></div>
      )}
      {!isPC && (
        <div style={{margin: '0px 0px 0px 0px'}}><Footer /></div>
      )}
    </Container>
  );
};

export default QueryDetail;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background: white;

  @media (min-width: 768px) {
    padding: 100px 70px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  color: ${({ theme }) => theme.colors.gray400};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;

  @media (min-width: 768px) {
    margin: 30px 110px 0;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const QueryDetailContainer = styled.div`
  padding: 20px;
  background: white;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const QueryHeader = styled.div`
  margin-bottom: 19px;
`;

const QueryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ theme }) => theme.font.fontSize.body12};
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.title16};
    padding-bottom: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  }
`;

const QueryAuthor = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const QueryDate = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
`;

const QueryTitle = styled.h1`
  font-size: ${({ theme }) => theme.font.fontSize.title16};
  font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
  color: ${({ theme }) => theme.colors.grayMain};
  margin-bottom: 8px;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.headline24};
    margin-bottom: 12px;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding-bottom: 10px;
  // background: ${props => props.status === 'ANSWERED' ? '#4CAF50' : '#FF8585'};
  color: #FF8585;
  // border-radius: 12px;
  font-size: ${({ theme }) => theme.font.fontSize.body12};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.body14};
  }
`;

const QueryContent = styled.div`
  font-size: ${({ theme }) => theme.font.fontSize.body13};
  color: ${({ theme }) => theme.colors.grayMain};
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;

  @media (min-width: 768px) {
    margin-top: 40px;
    font-size: ${({ theme }) => theme.font.fontSize.title16};
  }
`;

const Divider = styled.div`
  height: 4px;
  background-color: ${({ theme }) => theme.colors.pink100 || '#FFF1EF'};
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray300};
    width: 100%;
    margin-left: 0;
    margin-top: 100px;
    margin-bottom: 20px;
  }
`;

const AnswerSection = styled.div`
  margin-top: 20px;

  @media (min-width: 768px) {
    padding-top: 20px;
  }
`;

const AnswerSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.fontSize.body12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  color: ${({ theme }) => theme.colors.grayMain};
  margin-bottom: 24px;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.headline24};
    font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
    margin-bottom: 20px;
  }
`;

const AnswerItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.gray100 || '#F8F8F8'};
  border-radius: 8px;

  @media (min-width: 768px) {
    padding: 20px;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.gray200};
    border-radius: 3px;
  }
`;

const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const AnswerAuthor = styled.span`
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray500};

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.title16};
    font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
    color: ${({ theme }) => theme.colors.grayMain};
  }
`;

const AnswerDate = styled.span`
  font-size: ${({ theme }) => theme.font.fontSize.body10};
  color: ${({ theme }) => theme.colors.gray400};

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.body14};
  }
`;

const AnswerContent = styled.p`
  font-size: ${({ theme }) => theme.font.fontSize.body13};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  color: ${({ theme }) => theme.colors.grayMain};
  line-height: 1.6;
  white-space: pre-wrap;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.title16};
    font-weight: ${({ theme }) => theme.font.fontWeight.normal};
    margin-top: 16px;
  }
`;

const NoAnswerSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};

  p {
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    margin-bottom: 8px;

    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.font.fontSize.title16};
    }
  }
`;
