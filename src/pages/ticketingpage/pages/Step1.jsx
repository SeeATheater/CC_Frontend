
import React, { useState } from 'react';
import PosterInfo from '../components/PosterInfo';
import ActionButton from '../components/ActionButton';
import { FormSection, SectionTitle } from '../styles/commonStyles';
import {
  Input,
  Label,
  DatePickerContainer,
  DateInput,
  ArrowIcon,
  DropdownList,
  DropdownItem,
  PersonSelectionContainer,
  PersonInput,
} from '../styles/formStyles';
import SelectorIcon from '../components/icons/SelectorIcon.svg';

const Step1 = ({ 
  ticketing: { 
    dateTimeOptions,
    dateTime,
    people, 
    eventInfo, 
    nextActive, 
    setDateTime,
    setPeople, 
    goToNextStep 
  } 
}) => {
  const [showDateTimeDropdown, setShowDateTimeDropdown] = useState(false);
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);
  
  const toggleDateTimeDropdown = () => setShowDateTimeDropdown((prev) => !prev);
  const togglePersonDropdown = () => setShowPersonDropdown((prev) => !prev);
  const peopleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      <PosterInfo eventInfo={eventInfo} />
      
      <FormSection>
        <SectionTitle>관람일/ 회차 선택</SectionTitle>
        
        {/* 공연 날짜/시간 통합 선택 */}
        <Input>
          <Label>공연 날짜</Label>
          <DatePickerContainer>
            <DateInput>
              {dateTime || '선택'}
              <ArrowIcon src={SelectorIcon} alt="▼" onClick={toggleDateTimeDropdown}/>
            </DateInput>
            {showDateTimeDropdown && (
              <DropdownList>
                {dateTimeOptions.map((option) => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => {
                      setDateTime(option.value);
                      setShowDateTimeDropdown(false);
                    }}
                  >
                    {option.display}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DatePickerContainer>
        </Input>
        
        <Input>
          <Label>인원</Label>
          <PersonSelectionContainer>
            <PersonInput>
              {people || '선택'}
              <ArrowIcon src={SelectorIcon} alt="▼" onClick={togglePersonDropdown}/>
            </PersonInput>
            {showPersonDropdown && (
              <DropdownList>
                {peopleOptions.map((num) => (
                  <DropdownItem
                    key={num}
                    onClick={() => {
                      setPeople(num);
                      setShowPersonDropdown(false);
                    }}
                  >
                    {num}명
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </PersonSelectionContainer>
        </Input>
      </FormSection>
      
      <ActionButton isActive={nextActive} onClick={goToNextStep} className="bottom">
        다음
      </ActionButton>
    </>
  );
};

export default Step1;