
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '@/components/TopBar';
import Modal from '@/pages/board/components/Modal';
import useModal from '@/pages/board/hooks/useModal';
import useNavigationBlocker from '@/pages/board/hooks/useNavigationBlocker';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import useResponsive from '@/pages/board/hooks/useResponsive';
import Back from '@/pages/board/components/Icons/Back.svg';

const CreateQuery = () => {
  const navigate = useNavigate();
  const isPC = useResponsive();
  const { fetchData } = useCustomFetch();
  
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isExitModalOpen, openModal: openExitModal, closeModal: closeExitModal } = useModal();

  // 뒤로가기 차단
  useNavigationBlocker(
    !isExitModalOpen ? openExitModal : () => {}
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.title.trim() && formData.content.trim();

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetchData('/inquirys', 'POST', {
        title: formData.title.trim(),
        content: formData.content.trim()
      });

      if (response?.status === 200 || response?.data) {
        navigate('/mypage/query/success', { replace: true }); 
      } else {
        alert('문의 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('문의 등록 실패:', error);
      alert('문의 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 백버튼: 모달 오픈
  const handleBack = () => {
    openExitModal();
  };

  // 모달 액션
  const exitModalActions = [
    {
      label: '취소',
      type: 'cancel',
      onClick: () => {
        closeExitModal();
        window.history.pushState(null, '', window.location.href);
      }
    },
    {
      label: '나가기',
      type: 'confirm',
      onClick: () => {
        closeExitModal();
        navigate('/mypage/query', { replace: true });
      }
    }
  ];

  return (
    <Container>
      {!isPC && (
        <Header>
          <BackButton onClick={handleBack} src={Back} />
          <HeaderTitle>1:1 문의</HeaderTitle>
          <CompleteButton 
            onClick={handleSubmit} 
            disabled={!isFormValid || isSubmitting}
          >
            완료
          </CompleteButton>
        </Header>
      )}

      <ContentArea>
        <FormContainer>
          <FormField>
            <RegisterBtnContainer>
              <TitleInput
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={100}
                disabled={isSubmitting}
              />
              {isPC && (
                <RegisterButton 
                  disabled={!isFormValid || isSubmitting} 
                  onClick={isFormValid && !isSubmitting ? handleSubmit : undefined}
                >
                  {isSubmitting ? '처리중...' : '등록'}
                </RegisterButton>
              )}
            </RegisterBtnContainer>
          </FormField>

          <FormField>
            <ContentTextarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="문의 내용을 입력하세요"
              rows={isPC ? 15 : 10}
              disabled={isSubmitting}
            />
          </FormField>
        </FormContainer>
      </ContentArea>

      <Modal
        isOpen={isExitModalOpen}
        onClose={() => {
          closeExitModal();
          window.history.pushState(null, '', window.location.href);
        }}
        title="작성을 취소하시겠어요?"
        actions={exitModalActions}
      />
    </Container>
  );
};

export default CreateQuery;

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

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  height: 72px;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const BackButton = styled.img`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayMain};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.font.fontSize.title16};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayMain};
`;

const CompleteButton = styled.button`
  font-size: ${({ theme }) => theme.font.fontSize.title16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  color: ${props => props.disabled ? ({ theme }) => theme.colors.gray400 : ({ theme }) => theme.colors.pink600};
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;

  @media (min-width: 768px) {
    margin: 0 110px;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const FormContainer = styled.div`
  padding: 20px;

  @media (min-width: 768px) {
    padding: 0;
    margin-top: 100px;
  }
`;

const FormField = styled.div`
  margin-bottom: 24px;
`;

const RegisterBtnContainer = styled.div`
  @media (min-width: 768px) {
    display: flex;
    gap: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  background: transparent;
  font-size: ${({ theme }) => theme.font.fontSize.title16};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  color: ${({ theme }) => theme.colors.grayMain};
  outline: none;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.headline24};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
    padding-bottom: 10px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  padding: 16px 0;
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  color: ${({ theme }) => theme.colors.grayMain};
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.font.fontSize.title16};
    // margin-top: 40px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const RegisterButton = styled.button`
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  border-radius: 3px;
  width: 80px;
  height: 33px;
  padding: 8px 14px;
  text-align: center;
  color: ${props => props.disabled ? ({ theme }) => theme.colors.gray400 : '#FFFFFF'};
  background-color: ${props => props.disabled ? ({ theme }) => theme.colors.gray200 : ({ theme }) => theme.colors.pink600};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.pink700 || '#e55f5f'};
  }
`;
