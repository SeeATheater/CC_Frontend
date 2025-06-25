
import { useState, useEffect } from 'react';

const useTicketing = () => {
  // 공연의 날짜+시간 MOCK data
  const dateTimeOptions = [
    { value: '2025.05.14 (수) 15:00', display: '2025.05.14 (수) 15:00' },
    { value: '2025.05.14 (수) 17:00', display: '2025.05.14 (수) 17:00' },
    { value: '2025.05.14 (수) 19:00', display: '2025.05.14 (수) 19:00' },
    { value: '2025.05.15 (목) 16:00', display: '2025.05.15 (목) 16:00' },
    { value: '2025.05.15 (목) 20:00', display: '2025.05.15 (목) 20:00' },
    { value: '2025.05.16 (금) 13:00', display: '2025.05.16 (금) 13:00' },
    { value: '2025.05.16 (금) 16:00', display: '2025.05.16 (금) 16:00' },
    { value: '2025.05.16 (금) 19:00', display: '2025.05.16 (금) 19:00' },
    { value: '2025.05.17 (토) 16:00', display: '2025.05.17 (토) 16:00' },
    { value: '2025.05.17 (토) 19:00', display: '2025.05.17 (토) 19:00' },
    { value: '2025.05.18 (일) 11:00', display: '2025.05.18 (일) 11:00' },
    { value: '2025.05.18 (일) 13:00', display: '2025.05.18 (일) 13:00' },
    { value: '2025.05.18 (일) 15:00', display: '2025.05.18 (일) 15:00' },
    { value: '2025.05.18 (일) 17:00', display: '2025.05.18 (일) 17:00' },
  ];
  const [step, setStep] = useState(1);
  const [dateTime, setDateTime] = useState(null);
  const [people, setPeople] = useState(null);
  const [discountType, setDiscountType] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [deliveryType, setDeliveryType] = useState(null);
  const [nextActive, setNextActive] = useState(false);
  const [studentId, setStudentId] = useState(''); // 학번 입력
  const [depositorName, setDepositorName] = useState(''); // 입금자명 입력
  const [termsAgreed, setTermsAgreed] = useState(false); // 약관 동의 체크

  // 다음 버튼 활성화 여부 확인
  useEffect(() => {
    if (step === 1) {
      setNextActive(dateTime && people);
    } else if (step === 2) {
      let isValid = discountType !== null && paymentType !== null && deliveryType !== null;
      
      if (discountType === 'standard') {
        isValid = isValid && studentId.trim() !== '';   // 홍대생 할인 선택 시 학번 입력
      }
      if (paymentType === 'bank') {
        isValid = isValid && depositorName.trim() !== '';   // 입금 선택 시 입금자명 입력
      }
      if (paymentType === 'pay') {
        isValid = isValid && termsAgreed;   // 카카오페이 선택 시 약관 동의 
      }
      
      setNextActive(isValid);
    }
  }, [step, dateTime, people, discountType, paymentType, deliveryType, studentId, depositorName, termsAgreed]);

  // 다음 단계로 이동
  const goToNextStep = () => {
    if (nextActive) {
      setStep(step + 1);
    }
  };

  // 이전 단계로 이동
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // 예약 정보 확인 화면으로 이동 (임시)
  const viewReservation = () => {
    window.alert('예약 정보 확인 화면으로 이동합니다.');
  };

  // 이벤트 정보
  const eventInfo = {
    title: '실종',
    venue: '홍익대학교 학생회관 3층 소극장',
    posterUrl: ''
  };

  // 결제 정보 계산
  const calculatePayment = () => {
    const basePrice = 10000;
    const discountAmount = discountType === 'standard' ? 3000 : 0;
    const deliveryFee = 0; // 현장수령은 0원
    
    return {
      basePrice,
      discountAmount,
      deliveryFee,
      totalPrice: basePrice - discountAmount + deliveryFee
    };
  };

  return {
    // 상태
    dateTimeOptions,
    step,
    dateTime,
    people,
    discountType,
    paymentType,
    deliveryType,
    nextActive,
    eventInfo,
    studentId,
    depositorName,
    termsAgreed,
    
    // 액션
    setDateTime,
    setPeople,
    setDiscountType,
    setPaymentType,
    setDeliveryType,
    goToNextStep,
    goToPreviousStep,
    viewReservation,
    setStudentId,
    setDepositorName,
    setTermsAgreed,
    
    // 계산된 값
    calculatePayment
  };
};

export default useTicketing;