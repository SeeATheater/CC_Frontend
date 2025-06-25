
import React from 'react';
import PosterInfo from '../components/PosterInfo';
import RadioGroup from '../components/RadioGroup';
import ActionButton from '../components/ActionButton';
import { FormSection, SelectionSection, SectionTitle } from '../styles/commonStyles';
import { SummaryRow } from '../styles/summaryStyles';
import { 
  Divider, 
  Label, 
  AdditionalInputField,
  BankInfo,
  PaymentNotice,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  Showmore,
} from '../styles/formStyles'; 
import ShowMore from '../components/icons/ShowMore.svg';

const Step2 = ({ 
  ticketing: { 
    dateTime, 
    people, 
    eventInfo, 
    discountType, 
    paymentType,
    deliveryType, 
    nextActive,
    setDiscountType,
    setPaymentType, 
    setDeliveryType, 
    goToNextStep,
    calculatePayment,
    studentId,
    setStudentId,
    depositorName,
    setDepositorName,
    termsAgreed,
    setTermsAgreed
  } 
}) => {
  const discountOptions = [
    { value: 'standard', label: '홍대생 할인' },
    { value: 'none', label: '없음' }
  ];

  const deliveryOptions = [
    { value: 'venue', label: '현장 수령' }
  ];

  const paymentOptions = [
    { value: 'bank', label: '입금 (주) 홍익극연구회' },
    { value: 'pay', label: '카카오페이' }
  ];

  // 할인 선택 추가 컨텐츠 정의
  const discountAdditionalContent = {
    standard: (
      <AdditionalInputField>
        <input
          type="text"
          placeholder="학번을 입력하세요"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </AdditionalInputField>
    )
  };

  // 결제 수단 추가 컨텐츠 정의
  const paymentAdditionalContent = {
    bank: (
      <div style={{ marginTop: '-4px' }}>
        <BankInfo>
          국민은행 112233445566745
        </BankInfo>
        <AdditionalInputField style={{ marginTop: '8px' }}>
          <input
            type="text"
            placeholder="입금자명을 입력하세요"
            value={depositorName}
            onChange={(e) => setDepositorName(e.target.value)}
          />
        </AdditionalInputField>
        <PaymentNotice>
          예매후 24시간동안 미입금시 자동 취소됩니다.
        </PaymentNotice>
      </div>
    ),
    pay: (
      <CheckboxContainer style={{ marginLeft: '-22px' }}>
        {/* 카카오페이는 marginLeft: 0으로 조정 (이미 RadioGroup에서 22px 적용) */}
        <CheckboxInput
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
        />
        <CheckboxLabel>
          결제대행 서비스 이용 약관 동의
        </CheckboxLabel>
        <Showmore src={ShowMore} alt=">" /* onClick={ 추후 추가 } */ />
      </CheckboxContainer>
    )
  };

  const payment = calculatePayment();

  return (
    <>
      <PosterInfo eventInfo={eventInfo} />
      
      <FormSection>
        <SectionTitle>할인 선택</SectionTitle>
        <SelectionSection>
            <Label>할인 선택</Label>
            <RadioGroup 
            options={discountOptions} 
            selectedValue={discountType} 
            onChange={setDiscountType} 
            additionalContent={discountAdditionalContent}
            />
        </SelectionSection>
      </FormSection>
      
      {discountType && (
        <FormSection>
            <SectionTitle>티켓 수령</SectionTitle>
            <SelectionSection>
                <Label>티켓 수령</Label>
                <RadioGroup 
                options={deliveryOptions} 
                selectedValue={deliveryType} 
                onChange={setDeliveryType} 
                />
            </SelectionSection>
        </FormSection>
      )}

      {discountType && deliveryType && (
        <FormSection>
            <SectionTitle>결제</SectionTitle>
            <SelectionSection>
                <Label>결재 수단</Label>
                <RadioGroup 
                options={paymentOptions} 
                selectedValue={paymentType} 
                onChange={setPaymentType} 
                additionalContent={paymentAdditionalContent}
                />
            </SelectionSection>
        </FormSection>
      )}

      <Divider />
      
      <FormSection>
        <SectionTitle>예매 내용</SectionTitle>
        <SummaryRow>
          <div>일시</div>
          <span>{dateTime || ''}</span>
        </SummaryRow>
        <SummaryRow>
          <div>인원</div>
          <span>{people || ''}</span>
        </SummaryRow>
        <SummaryRow>
          <div>티켓 금액</div>
          <span>{payment.basePrice.toLocaleString()}원</span>
        </SummaryRow>
        <SummaryRow>
          <div>할인</div>
          <span className={discountType ? "discount" : ""}>
            {discountType ? `-${payment.discountAmount.toLocaleString()}원` : ''}
          </span>
        </SummaryRow>
        <SummaryRow>
          <div>배송료</div>
          <span>{deliveryType ? `${payment.deliveryFee.toLocaleString()}원 (현장수령)` : ''}</span>
        </SummaryRow>
        <SummaryRow className="total">
          <div>총 결제 금액</div>
          <span>{(payment.totalPrice * people).toLocaleString()}원</span>
        </SummaryRow>
      </FormSection>
      
      <ActionButton isActive={nextActive} onClick={goToNextStep}>
        다음
      </ActionButton>
    </>
  );
};

export default Step2;