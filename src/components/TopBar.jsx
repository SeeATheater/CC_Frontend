import styled from 'styled-components';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';

function TopBar({ onPrev, onNext, nextText, children }) {
	return (
		<div style={{ height: '120px' }}>
			<Top>
				<ChevronLeftPink />
				<p>{children}</p>
				<button onClick={onNext}>{nextText}</button>
			</Top>
		</div>
	);
}

export default TopBar;
const ChevronLeftPink = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.pink600};
	height: 16px;
`;
const Top = styled.div`
	display: flex;
	flex: 1;
	gap: 12px;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 20px 24px;
	padding-top: 76px;
	@media (min-width: 768px) {
		height: 140px;
	}

	p {
		color: ${({ theme }) => theme.colors.grayMain};
		text-align: center;

		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		letter-spacing: -0.48px;
		margin: 0px;
	}
	button {
		color: gray;
		/*visibility: hidden;*/
	}
`;
