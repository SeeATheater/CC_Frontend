
import React from 'react';
import { RadioButtonGroup, RadioOption, RadioCircle, RadioLabel } from '../styles/formStyles';

const RadioGroup = ({ options, selectedValue, onChange, additionalContent = {} }) => {
  return (
    <RadioButtonGroup>
      {options.map((option) => (
        <React.Fragment key={option.value}>
          <RadioOption>
            <RadioCircle 
              className={selectedValue === option.value ? 'selected' : ''} 
              onClick={() => {
                if (selectedValue === option.value) {
                onChange(null);
                } else {
                onChange(option.value);
                }
              }}
            />
            <RadioLabel>{option.label}</RadioLabel>
          </RadioOption>

          {/* 선택된 옵션의 추가 컨텐츠 조건부 렌더링 */}
          {selectedValue === option.value && additionalContent[option.value] && (
            <div style={{ 
              marginTop: '0px',    // 
              marginLeft: '22px',   // 우측으로 22px 이동
              marginBottom: '4px'  // 다음 옵션과의 간격
            }}>
              {additionalContent[option.value]}
            </div>
          )}
        </React.Fragment>
      ))}
    </RadioButtonGroup>
  );
};

export default RadioGroup;