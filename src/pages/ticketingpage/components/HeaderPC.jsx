import React from 'react';
import {
	Header as HeaderContainer,
	PageTitle,
} from '@/pages/ticketingpage/styles/commonStyles';

const HeaderPC = ({ currentStep = 1 }) => {
	const steps = [
		'01 관람일/회차 선택',
		'02 할인 선택',
		'03 티켓 수령 선택',
		'04 결제 하기',
	];

	const titleClassName = (index) => {
		if (index === currentStep - 1) {
			return 'active'; // 현재 단계
		} else if (index < currentStep - 1) {
			return 'done'; // 완료된 단계
		} else {
			return null; // 미완료 단계
		}
	};

	return (
		<HeaderContainer>
			{steps.map((step, index) => (
				<PageTitle key={index} className={titleClassName(index)}>
					{step}
				</PageTitle>
			))}
		</HeaderContainer>
	);
};

export default HeaderPC;
