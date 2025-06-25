
import styled from 'styled-components';

// 앱 전체 컨테이너
export const AppContainer = styled.div`
  width: 402px;
  height: 830px;
  margin: 0 auto;
  background-color: white;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 헤더 관련 스타일
export const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  position: relative;
  height: 72px;
  border-bottom: 1px solid white;
  flex-shrink: 0;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #F67676;
  font-size: 24px;
  padding: 0;
  cursor: pointer;
`;

export const PageTitle = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

// 스크롤
export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  /* 스크롤바 완전히 숨김 */
  &::-webkit-scrollbar {
    display: none; /* 웹킷 브라우저에서 스크롤바 숨김 */
  }
  
  /* Firefox에서 스크롤바 숨김 */
  scrollbar-width: none;
  
  /* IE에서 스크롤바 숨김 */
  -ms-overflow-style: none;
`;

// 메인 컨텐츠 영역
export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
  position: relative;
`;

// 포스터 및 공연 정보 영역
export const PosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Poster = styled.img`
  width: 160px;
  height: 220px;
  border-radius: 3px;
`;

export const EventTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 5px 0;
`;

export const EventVenue = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #929292;
  text-align: center;
`;

// 섹션 관련 스타일
export const FormSection = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #F67676;
  margin-bottom: 20px;
`;

export const SelectionSection = styled.div`
  display: flex;
  position: relative;
`;

// 액션 버튼 스타일
export const ActionButton = styled.button`
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  
  &.primary {
    background-color: #F67676;
    color: white;
  }
  
  &.disabled {
    background-color: #e0e0e0;
    color: #999;
    cursor: not-allowed;
  }

  &.bottom {
    position: absolute;
    bottom: 30px;
    width: 362px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
`;

export const SuccessMessage = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #F67676;
  font-size: 18px;
  font-weight: bold;
`;