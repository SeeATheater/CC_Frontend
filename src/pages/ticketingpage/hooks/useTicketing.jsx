
import { useState, useEffect } from 'react';
import useResponsive from '@/pages/ticketingpage/hooks/useResponsive';
import { ticketingAPI } from '@/pages/ticketingpage/api/ticketApi.js';

const useTicketing = (amateurShowId) => {
  // 기본 상태
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextActive, setNextActive] = useState(false);
  const isPC = useResponsive();

  // 공연 정보
  const [eventInfo, setEventInfo] = useState({
    title: '',
    venue: '',
    period: '',
    posterUrl: ''
  });

  // 예매 정보
  const [dateTimeOptions, setDateTimeOptions] = useState([]);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [people, setPeople] = useState(null);
  const [discountType, setDiscountType] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [deliveryType, setDeliveryType] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [reservationData, setReservationData] = useState(null);  // 예매 완료 상태 (카카오페이 결제 후)

  // 공연 간략 정보 조회
  const fetchShowInfo = async () => {
    if (!amateurShowId) return;
    
    setLoading(true);
    try {
      const response = await ticketingAPI.getShowSimple(amateurShowId);
      const showData = response.result || response;
      
      setEventInfo({
        title: showData.name || '',
        venue: showData.detailAddress  || '',
        period: '', // 
        posterUrl: showData.posterImageUrl || ''
      });
    } catch (err) {
      setError('공연 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching show info:', err);
    } finally {
      setLoading(false);
    }
  };

  // 회차 정보 조회
  const fetchRounds = async () => {
    if (!amateurShowId) return;

    setLoading(true);
    try {
      const response = await ticketingAPI.getShowRounds(amateurShowId);
      // API 응답에서 result 추출
      const rounds = response.result || response;
      
      // 배열인지 확인
      if (!Array.isArray(rounds)) {
        throw new Error('회차 정보가 올바른 형식이 아닙니다.');
      }

      const formattedOptions = rounds.map(round => ({
        value: round.roundId,
        display: formatDateTime(round.performanceDateTime),
        roundData: round
      }));
      setDateTimeOptions(formattedOptions);
    } catch (err) {
      setError('회차 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching rounds:', err);
    } finally {
      setLoading(false);
    }
  };

  // 티켓 종류 조회
  const fetchTicketTypes = async () => {
    if (!amateurShowId) return;

    setLoading(true);
    try {
      const response = await ticketingAPI.getTicketTypes(amateurShowId);
      const tickets = response.result || response;
      
      // 배열인지 확인
      if (!Array.isArray(tickets)) {
        throw new Error('티켓 정보가 올바른 형식이 아닙니다.');
      }
      
      setTicketOptions(tickets);
    } catch (err) {
      setError('티켓 종류를 불러오는데 실패했습니다.');
      console.error('Error fetching ticket types:', err);
    } finally {
      setLoading(false);
    }
  };

  // 날짜/시간 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
  };

  // 날짜/시간 선택 핸들러
  const handleDateTimeChange = (roundId) => {
    const selectedOption = dateTimeOptions.find(option => option.value === roundId);
    if (selectedOption) {
      setSelectedRound(selectedOption.roundData);
      setDateTime(selectedOption.display);
    }
  };

  // 최대 단계 수 계산
  const getMaxSteps = () => 5;

  // 현재 단계의 컨텐츠 타입 반환
  const getCurrentStepContent = () => {
    if (!isPC) {
      switch(step) {
        case 1: return 'datetime';
        case 2:
        case 3:
        case 4: return 'options';
        case 5: return 'complete';
        default: return 'datetime';
      }
    } else {
      switch(step) {
        case 1: return 'datetime';
        case 2: return 'discount';
        case 3: return 'delivery';
        case 4: return 'payment';
        case 5: return 'complete';
        default: return 'datetime';
      }
    }
  };

  // 다음 버튼 활성화 여부 확인
  useEffect(() => {
    const currentContent = getCurrentStepContent();
    
    switch(currentContent) {
      case 'datetime':
        setNextActive(dateTime && people && selectedRound);
        break;
        
      case 'discount':
        let discountValid = discountType !== null;
        if (discountType === 'standard') {
          discountValid = discountValid && studentId.trim() !== '';
        }
        setNextActive(discountValid);
        break;
        
      case 'delivery':
        setNextActive(deliveryType !== null);
        break;
        
      case 'payment':
        let paymentValid = paymentType !== null;
        if (paymentType === 'bank') {
          paymentValid = paymentValid && depositorName.trim() !== '';
        }
        if (paymentType === 'pay') {
          paymentValid = paymentValid && termsAgreed;
        }
        setNextActive(paymentValid);
        break;
        
      case 'options':
        let optionsValid = discountType !== null && paymentType !== null && deliveryType !== null;
        if (discountType === 'standard') {
          optionsValid = optionsValid && studentId.trim() !== '';
        }
        if (paymentType === 'bank') {
          optionsValid = optionsValid && depositorName.trim() !== '';
        }
        if (paymentType === 'pay') {
          optionsValid = optionsValid && termsAgreed;
        }
        setNextActive(optionsValid);
        break;
        
      default:
        setNextActive(false);
    }
  }, [step, dateTime, people, selectedRound, discountType, paymentType, deliveryType, studentId, depositorName, termsAgreed, isPC]);

  // 다음 단계로 이동
  const goToNextStep = () => {
    const currentContent = getCurrentStepContent();
    if (nextActive) {
      if (currentContent === 'options') setStep(5);
      else setStep(step + 1);
    }
  };

  // 이전 단계로 이동
  const goToPreviousStep = () => {
    const currentContent = getCurrentStepContent();
    if (step > 1) {
      if (currentContent === 'options') setStep(1);
      else setStep(step - 1);
    }
  };

  // 티켓 예매 실행
  const reserveTicket = async () => {
    if (!selectedRound || !selectedTicket || !people) {
      setError('필수 정보가 누락되었습니다.');
      return;
    }

    setLoading(true);
    try {
      // 1단계: 먼저 티켓을 예매하여 memberTicketId를 받아옴
      const requestData = {
        quantity: people
      };

      const reserveResponse = await ticketingAPI.reserveTicket(
        amateurShowId,
        selectedRound.roundId,
        selectedTicket.amateurTicketId,
        requestData
      );

      // API 응답에서 memberTicketId 추출
      const ticketData = reserveResponse.result || reserveResponse;
      const memberTicketId = ticketData.memberTicketId;

      if (!memberTicketId) {
        throw new Error('티켓 예매 중 오류가 발생했습니다.');
      }

      // 2단계: 카카오페이 결제 준비
      const paymentResponse = await ticketingAPI.prepareKakaoPayment(memberTicketId);
      const paymentData = paymentResponse.result || paymentResponse;

      // 결제 데이터 저장 (결제 완료 후 사용)
      setReservationData({
        ...ticketData,
        memberTicketId
      });

      // 3단계: 카카오페이 결제 페이지로 리디렉션
      if (paymentData.next_redirect_pc_url || paymentData.next_redirect_mobile_url) {
        // PC인지 모바일인지에 따라 적절한 URL 선택
        const redirectUrl = isPC ? 
          paymentData.next_redirect_pc_url : 
          paymentData.next_redirect_mobile_url;
        
        // 카카오페이 결제 페이지로 이동
        window.location.href = redirectUrl;
      } else {
        throw new Error('결제 페이지 URL을 받아올 수 없습니다.');
      }

    } catch (err) {
      setError('예매 처리 중 오류가 발생했습니다.');
      console.error('Error reserving ticket:', err);
      setLoading(false);
      throw err;
    }
    // loading은 결제 완료 후 approve 콜백에서 false로 설정됨
  };

  // 결제 승인 완료 후 호출되는 함수 (결제 성공 시)
  const handlePaymentSuccess = () => {
    setLoading(false);
    setStep(5); // 완료 페이지로 이동
  };

  // 결제 실패 시 호출되는 함수
  const handlePaymentFailure = (errorMessage = '결제가 취소되었거나 실패했습니다.') => {
    setLoading(false);
    setError(errorMessage);
  };

  // 예약 정보 확인 화면으로 이동
  const viewReservation = () => {
    window.alert('예약 정보 확인 화면으로 이동합니다.');  // 실제로는 예약 내역 페이지로 라우팅해야 함 navigate('');
  };

  // 결제 정보 계산
  const calculatePayment = () => {
    if (!selectedTicket) {
      return {
        basePrice: 0,
        discountAmount: 0,
        deliveryFee: 0,
        totalPrice: 0
      };
    }

    const basePrice = selectedTicket.price;
    const discountAmount = discountType === 'standard' ? 3000 : 0; // 홍대생 할인
    const deliveryFee = 0; // 현장수령은 0원
    
    return {
      basePrice,
      discountAmount,
      deliveryFee,
      totalPrice: basePrice - discountAmount + deliveryFee
    };
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (amateurShowId) {
      fetchShowInfo();
      fetchRounds();
      fetchTicketTypes();
    }
  }, [amateurShowId]);

  // URL 파라미터에서 결제 결과 확인 (페이지 로드 시)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pgToken = urlParams.get('pg_token');
    const partnerOrderId = urlParams.get('partner_order_id');
    
    if (pgToken && partnerOrderId) {
      // 결제 성공으로 돌아온 경우
      handlePaymentSuccess();
      
      // URL에서 파라미터 제거 (브라우저 히스토리 정리)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return {
    // 상태
    dateTimeOptions,
    ticketOptions,
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
    isPC,
    loading,
    error,
    selectedRound,
    selectedTicket,
    reservationData,
    
    // 액션
    setDateTime: handleDateTimeChange,
    setPeople,
    setDiscountType,
    setPaymentType,
    setDeliveryType,
    goToNextStep,
    goToPreviousStep,
    reserveTicket,
    viewReservation,
    setStudentId,
    setDepositorName,
    setTermsAgreed,
    setSelectedTicket,
    handlePaymentSuccess,
    handlePaymentFailure,
    
    // 유틸리티
    calculatePayment,
    getCurrentStepContent,
    getMaxSteps,
  };
};

export default useTicketing;