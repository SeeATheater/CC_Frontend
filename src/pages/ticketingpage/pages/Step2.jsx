
import React from 'react';
import PosterInfo from '@/pages/ticketingpage/components/PosterInfo';
import RadioGroup from '@/pages/ticketingpage/components/RadioGroup';
import ActionButton from '@/pages/ticketingpage/components/ActionButton';
import LoadingSpinner from '@/pages/ticketingpage/components/LoadingSpinner';
import { 
  FormSection2, SelectionSection, SectionTitle, 
  EventTitle, EventVenue, EventPeriod, EventInfo, 
  EventLink, PcLayout, SummarySection, BackButton } from '@/pages/ticketingpage/styles/commonStyles';
import { SummaryRow } from '@/pages/ticketingpage/styles/summaryStyles';
import { 
  Divider, Label, AdditionalInputField,
  BankInfo, PaymentNotice, CheckboxContainer,
  CheckboxInput, CheckboxLabel, Showmore } from '@/pages/ticketingpage/styles/formStyles'; 
import useResponsive from '@/pages/ticketingpage/hooks/useResponsive';
import ShowMore from '@/pages/ticketingpage/components/icons/ShowMore.svg';

const Step2 = ({ 
  ticketing: { 
    dateTime, 
    people, 
    eventInfo, 
    ticketOptions,
    selectedTicket,
    setSelectedTicket,
    discountType, 
    paymentType,
    deliveryType, 
    nextActive,
    setDiscountType,
    setPaymentType, 
    setDeliveryType, 
    goToNextStep,
    goToPreviousStep,
    calculatePayment,
    studentId,
    setStudentId,
    depositorName,
    setDepositorName,
    termsAgreed,
    setTermsAgreed,
    getCurrentStepContent,
    reserveTicket,
    loading,
    error
  } 
}) => {

  const isPC = useResponsive();
  const currentContent = getCurrentStepContent();
  
  // PC: 개별 단계 / 모바일: 할인+수령+결제 통합
  const showDiscountOnly = isPC && currentContent === 'discount';
  const showDeliveryOnly = isPC && currentContent === 'delivery';
  const showPaymentOnly = isPC && currentContent === 'payment';
  const showAllOptions = !isPC && currentContent === 'options';

  // 티켓 옵션을 할인 옵션 형태로 변환
  const discountOptions = ticketOptions.map(ticket => ({
    value: ticket.amateurTicketId,
    label: `${ticket.discountName} - ${ticket.price.toLocaleString()}원`,
    ticketData: ticket
  }));

  const deliveryOptions = [
    { value: 'venue', label: '현장 수령' }
  ];

  const paymentOptions = [
    { value: 'pay', label: '카카오페이' }
  ];

  // 할인(티켓) 선택 핸들러
  const handleDiscountChange = (ticketId) => {
    const selectedOption = discountOptions.find(option => option.value === ticketId);
    if (selectedOption) {
      setSelectedTicket(selectedOption.ticketData);
      setDiscountType(ticketId);
    } else {
      setSelectedTicket(null);
      setDiscountType(null);
    }
  };

  // 할인 선택 추가 컨텐츠 정의
  const discountAdditionalContent = {
    ...(isPC ? {} : {
      // 홍대생 할인 티켓일 경우에만 학번 입력 필드 표시
      ...(selectedTicket && selectedTicket.discountName.includes('홍대생') ? {
        [selectedTicket.amateurTicketId]: (
          <AdditionalInputField>
            <input
              type="text"
              placeholder="학번을 입력하세요"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </AdditionalInputField>
        )
      } : {})
    })
  };

  // 결제 수단 추가 컨텐츠 정의
  const paymentAdditionalContent = {
    pay: (
      <CheckboxContainer style={{ marginLeft: isPC ? '0px' : '-22px' }}>
        <CheckboxInput
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
        />
        <CheckboxLabel>결제대행 서비스 이용 약관 동의</CheckboxLabel>
        <Showmore src={ShowMore} alt=">" />
      </CheckboxContainer>
    )
  };

  // 다음 버튼 클릭 핸들러
  const handleNextStep = async () => {
    if (currentContent === 'payment' || currentContent === 'options') {
      try {
        await reserveTicket();
        // reserveTicket 함수 내에서 카카오페이 페이지로 리디렉션됨
      } catch (error) {
        console.error('예매 실패:', error);
        // 에러 처리는 useTicketing에서 함
      }
    } else {
      goToNextStep();
    }
  };

  const payment = calculatePayment();

  if (loading && (currentContent === 'payment' || currentContent === 'options')) {
    return <LoadingSpinner message="결제 페이지로 이동 중..." />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#F67676' }}>
        <p>{error}</p>
        <ActionButton 
          isActive={true} 
          onClick={() => window.location.reload()}
        >
          다시 시도
        </ActionButton>
      </div>
    );
  }

  return (
    <>
      {!isPC && (
        <PosterInfo eventInfo={eventInfo} />
      )}
      {isPC && (
        <>
          <EventInfo style={{ marginTop: '0px' }}>
            <EventTitle>{eventInfo.title}</EventTitle>
            <EventLink src={ShowMore} alt=">" />
          </EventInfo>
          <EventVenue>{eventInfo.venue}</EventVenue>
          <EventPeriod style={{ width: 'auto' }}>{eventInfo.period}</EventPeriod>
        </>
      )}
      
      <PcLayout>
        {(showDiscountOnly || showAllOptions) && (
          <FormSection2>
            {!isPC && ( <SectionTitle>티켓 선택</SectionTitle> )}
            <SelectionSection>
                {!isPC && ( <Label>티켓 종류</Label> )}
                {isPC && ( <label style={{fontSize: '20px', fontWeight: 'bold', color: '#000000'}}>티켓 선택</label> )}
                <RadioGroup 
                  options={discountOptions} 
                  selectedValue={discountType} 
                  onChange={handleDiscountChange} 
                  additionalContent={discountAdditionalContent}
                />
                {/* isPC && selectedTicket && selectedTicket.discountName.includes('홍대생') && (
                  <>
                    <label style={{fontSize: '20px', fontWeight: 'bold', color: '#000000', marginTop: '32px'}}>할인 인증</label>
                    <SelectionSection>
                      <div style={{marginTop: '14px', display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: '80px', fontSize: '16px', fontWeight: 'bold', color: '#000000'}}>이름</div>
                        <div style={{marginLeft: '40px', fontWeight: '500'}}>최윤경</div>
                      </div>
                      <div style={{marginTop: '14px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{width: '80px', fontSize: '16px', fontWeight: 'bold', color: '#000000'}}>학번 입력</div>
                        <AdditionalInputField>
                          <input
                            type="text"
                            placeholder="학번을 입력하세요"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                          />
                        </AdditionalInputField>
                      </div>
                    </SelectionSection>
                  </>
                ) */}
            </SelectionSection>
          </FormSection2>
        )}
        
        {(showDeliveryOnly || (showAllOptions && discountType)) && (
          <FormSection2>
              {!isPC && ( <SectionTitle>티켓 수령</SectionTitle> )}
              <SelectionSection>
                  {!isPC && ( <Label>티켓 수령</Label> )}
                  {isPC && ( <label style={{fontSize: '20px', fontWeight: 'bold', color: '#000000'}}>티켓 수령</label> )}
                  <RadioGroup 
                  options={deliveryOptions} 
                  selectedValue={deliveryType} 
                  onChange={setDeliveryType} 
                  />
              </SelectionSection>
          </FormSection2>
        )}

        {(showPaymentOnly || (showAllOptions && discountType && deliveryType)) && (
          <FormSection2>
              {!isPC && ( <SectionTitle>결제</SectionTitle> )}
              <SelectionSection>
                  {!isPC && ( <Label>결재 수단</Label> )}
                  {isPC && ( <label style={{fontSize: '20px', fontWeight: 'bold', color: '#000000'}}>결제 수단</label> )}
                  <RadioGroup 
                  options={paymentOptions} 
                  selectedValue={paymentType} 
                  onChange={setPaymentType} 
                  additionalContent={paymentAdditionalContent}
                  />
              </SelectionSection>
          </FormSection2>
        )}

        {!isPC && ( <Divider /> )}
        
        <SummarySection>
          {!isPC && ( <SectionTitle>예매 내용</SectionTitle> )}
          <SummaryRow>
            <div>일시</div>
            <span>{dateTime || ''}</span>
          </SummaryRow>
          <SummaryRow>
            <div>인원</div>
            <span>{people || ''}명</span>
          </SummaryRow>
          <SummaryRow>
            <div>티켓 금액</div>
            <span>{payment.basePrice.toLocaleString()}원</span>
          </SummaryRow>
          <SummaryRow>
            <div>할인</div>
            <span className={payment.discountAmount > 0 ? "discount" : ""}>
              {payment.discountAmount > 0 ? `-${payment.discountAmount.toLocaleString()}원` : ''}
            </span>
          </SummaryRow>
          <SummaryRow>
            <div>배송료</div>
            <span>{deliveryType ? `${payment.deliveryFee.toLocaleString()}원 (현장수령)` : ''}</span>
          </SummaryRow>
          <SummaryRow className="total">
            <div>총 결제 금액</div>
            {!isPC && ( <span>{(payment.totalPrice * (people || 1)).toLocaleString()}원</span> )}
            {isPC && ( <span style={{fontSize: '24px', bottom: '4px'}}>{(payment.totalPrice * (people || 1)).toLocaleString()}원</span> )}
          </SummaryRow>
        </SummarySection>
      </PcLayout>
      {!isPC && (
        <ActionButton isActive={nextActive} onClick={handleNextStep}>
          {(currentContent === 'options') ? '예매하기' : '다음'}
        </ActionButton>
      )}
      {isPC && (
        <div style={{ marginLeft: '718px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <ActionButton isActive={nextActive} onClick={handleNextStep}>
            {(currentContent === 'payment') ? '예매하기' : '다음'}
          </ActionButton>
          <BackButton onClick={goToPreviousStep}>이전</BackButton>
        </div>
      )}
    </>
  );
};

export default Step2;