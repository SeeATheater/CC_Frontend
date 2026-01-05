import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const Message = styled.p`
  font-size: 18px;
  color: ${props => props.$error ? '#F67676' : '#333'};
  text-align: center;
  margin-bottom: 20px;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #F67676;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const KakaoPayApprove = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const partnerOrderId = searchParams.get('partner_order_id');
    const pgToken = searchParams.get('pg_token');

    if (partnerOrderId && pgToken) {
      // 결제가 성공적으로 완료됨
      setStatus('success');
      
      // sessionStorage에서 playId 가져오기
      const playId = sessionStorage.getItem('ticketing_playId');
      
      // 잠시 후 티켓팅 완료 페이지(Step5)로 이동
      setTimeout(() => {
        if (playId) {
          // 기존 티켓팅 페이지의 완료 화면으로 이동
          navigate(`/ticketing/${playId}`, { 
            replace: true,
            state: { paymentSuccess: true, step: 5 }
          });
          // 사용 후 sessionStorage 정리
          sessionStorage.removeItem('ticketing_playId');
        } else {
          // playId가 없으면 홈으로 이동
          navigate('/home', { replace: true });
        }
      }, 1500);
    } else {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
    }
  }, [searchParams, navigate]);

  return (
    <Container>
      {status === 'processing' && (
        <>
          <Spinner />
          <Message>결제 처리 중입니다...</Message>
        </>
      )}
      
      {status === 'success' && (
        <>
          <Spinner />
          <Message>결제 처리 중입니다...</Message>
        </>
      )}
      
      {status === 'error' && (
        <Message $error>{errorMessage}</Message>
      )}
    </Container>
  );
};

export default KakaoPayApprove;
