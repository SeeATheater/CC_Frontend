import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useResponsive from '@/pages/board/hooks/useResponsive';

const SuccessQuery = () => {
  const navigate = useNavigate();
  const isPC = useResponsive();

  const handleViewQueries = () => {
    navigate('/mypage/query');
  };

  return (
    <Container>
      <SuccessMessage>
        {isPC && (
          <Title>
            정상적으로 접수되었습니다!
          </Title>
        )}
        {!isPC && (
          <Title>
            정상적으로 접수되었습니다!
          </Title>
        )}
        <ActionButton onClick={handleViewQueries}>
          문의한 내용 보러가기
        </ActionButton>
      </SuccessMessage>
    </Container>
  );
};

export default SuccessQuery;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 20px;
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 400px;

  @media (min-width: 768px) {
    gap: 60px;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.fontSize.headline24};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  color: ${({ theme }) => theme.colors.pink600};
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.title16};
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #E6E6E6;
  color: black;
  border-radius: 3px;
  font-size: ${({ theme }) => theme.font.fontSize.title16};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border: 1px solid #000000;
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    padding: 14px;
  }
`;
