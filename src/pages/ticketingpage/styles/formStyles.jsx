
import styled from 'styled-components';

// 입력 영역 관련 스타일
export const Input = styled.div`
  position: relative;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #929292;
  display: block;
  margin-bottom: 8px;
`;

export const DatePickerContainer = styled.div`
  width: 206px;
  height: 32px;
  display: flex;
  border: 1px solid #FFD6D4;
  border-radius: 2px;
  position: absolute;
  left: 100px;
`;

export const DateInput = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 4px 12px 4px 12px;
  text-align: center;
  position: relative;
`;

export const ArrowIcon = styled.img`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 7px;
  cursor: pointer;
`;

export const PersonSelectionContainer = styled.div`
  width: 80px;
  height: 32px;
  display: flex;
  border: 1px solid #FFD6D4;
  border-radius: 2px;
  position: absolute;
  left: 100px;
`;

export const PersonInput = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 4px 12px 4px 12px;
  text-align: center;
  position: relative;
`;

//드롭다운 스타일
export const DropdownList = styled.ul`
  position: absolute;
  top: 34px;
  left: 0;
  width: 100%;
  border: 1px solid #FFD6D4;
  border-radius: 2px;
  background-color: white;
  z-index: 20;
  max-height: 130px; /* 4개 까지 보여줌 */
  text-align: center;

  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #FFD6D4;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #FF8585;
  }
`;

export const DropdownItem = styled.li`
  height: 32px;
  padding: 8px 12px;
  cursor: pointer;
  list-style: none;
  border-bottom: 1px solid #FFD6D4;
  &:last-child {
    border-bottom: none; 
  }
  &:hover {
    background-color: #FFF1EF;
  }
`;

// 라디오 버튼 그룹 스타일
export const RadioButtonGroup = styled.div`
  margin-left: 48px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RadioCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #FF8585;
  position: relative;
  
  &.selected {
    border-color: #F67676;
    
    &:after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #F67676;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export const RadioLabel = styled.label`
  font-size: 14px;
`;

// 구분선 
export const Divider = styled.div`
  height: 4px;
  background-color: #FFF1EF;
  width: 402px;
  margin-left: -20px;
`;

// additional contents 관련 스타일들
// 추가 입력 필드 (학번, 입금자명)
export const AdditionalInputField = styled.div`
  padding: 4px 12px;
  width: 230px;
  height: 34px;
  background: #F8F8F8;
  border-radius: 3px;
  
  input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: #000000;
    
    &::placeholder {
      color: #929292;
    }
  }
`;

// 계좌 정보 표시
export const BankInfo = styled.div`
  font-size: 14px;
  color: #000;
`;

// 결제 안내 문구
export const PaymentNotice = styled.div`
  margin-top: 4px;
  font-size: 10px;
  font-weight: 400;
  color: #696969;
`;

// 체크박스 컨테이너
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 230px;
  height: 28px;
  background: #F8F8F8;
  border-radius: 3px;
`;

// 커스텀 체크박스 입력
export const CheckboxInput = styled.input`
  margin-left: 8px;
  appearance: none;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border: 1px solid #F67676;
  border-radius: 1px;
  position: relative;
  cursor: pointer;
  
  &:checked {
    &:after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #F67676;
      border-radius: 1px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

// 체크박스 라벨
export const CheckboxLabel = styled.div`
  margin-left: 8px;
  font-size: 12px;
  color: #929292;
`;

// 약관 링크
export const Showmore = styled.img`
  margin-left: 34px;
  cursor: pointer;
  width: 6px;
  height: 12px;
`;