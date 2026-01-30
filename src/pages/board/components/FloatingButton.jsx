
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FloatingButton as StyledFloatingButton,
  FloatingIcon
} from '@/pages/board/styles/commonStyles';
import Pen from '@/pages/board/components/Icons/Pen.svg';
import { useAuth } from '@/context/AuthContext';

const FloatingButton = ({ show = true, category = 'general' }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) {
      // alert('로그인이 필요한 서비스입니다.'); - 별도 모달 필요??
      navigate('/');
      return;
    }
    
    // 권한 확인은 sessionStorage에서 즉시
    const role = sessionStorage.getItem('selectedRole');
    if (category === 'promotion' && role !== 'PERFORMER') {
      // alert('홍보글은 공연자만 작성 가능합니다.');
      return;
    }

    navigate(`/board/create?category=${category}`);
  };

  if (!show) return null;

  return (
    <StyledFloatingButton onClick={handleClick}>
      <FloatingIcon src={Pen} />
    </StyledFloatingButton>
  );
};

export default FloatingButton;