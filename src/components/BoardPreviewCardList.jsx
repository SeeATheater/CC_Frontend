import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function BoardPreviewCardList({ data }) {
	const navigate=useNavigate();
	const mockData = [
		{
			title: '상상도 못한 게시판..ㄴ(°0°)ㄱ',
			content:
				'우오앙 여기도 이런 게시판이 있구나 신기방기 많이 많이 게시판 이용해야겟다~ 이건 아마 3줄 넘어가면 ... 으로 대체합시...',
		},
		{
			title: '상상도 못한 게시판..ㄴ(°0°)ㄱ',
			content:
				'우오앙 여기도 이런 게시판이 있구나 신기방기 많이 많이 게시판 이용해야겟다~ 이건 아마 3줄 넘어가면 ... 으로 대체합시...',
		},
		{
			title: '상상도 못한 게시판..ㄴ(°0°)ㄱ',
			content:
				'우오앙 여기도 이런 게시판이 있구나 신기방기 많이 많이 게시판 이용해야겟다~ 이건 아마 3줄 넘어가면 ... 으로 대체합시...',
		},
		{
			title: '상상도 못한 게시판..ㄴ(°0°)ㄱ',
			content:
				'우오앙 여기도 이런 게시판이 있구나 신기방기 많이 많이 게시판 이용해야겟다~ 이건 아마 3줄 넘어가면 ... 으로 대체합시...',
		},
	];

	const scrollRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollLeft(scrollRef.current.scrollLeft);
	};
	const handleMouseLeave = () => setIsDragging(false);
	const handleMouseUp = () => setIsDragging(false);
	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startX) * 1;
		scrollRef.current.scrollLeft = scrollLeft - walk;
	};

	console.log('핫게', data);
	return (
		<Wrapper>
			<CardList
				ref={scrollRef}
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeave}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			>
				{data &&
					data?.result.content.map((item) => (
						<Card key={item.boardId}>
							<h3>{item.title}</h3>
							<p>{item.content}</p>
						</Card>
					))}
			</CardList>
		</Wrapper>
	);
}
export default BoardPreviewCardList;

const Wrapper = styled.div``;

const CardList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px;
	overflow-x: auto;
	padding-bottom: 8px; /* 스크롤 안 보이게 여유 */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE/Edge */

	&::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}
`;
const Card = styled.div`
	display: flex;
	min-width: 265px;
	padding: 20px;
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
	border-radius: 3px;
	background: var(--color-gray-200, #f8f8f8);
	h3 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		letter-spacing: -0.42px;
	}
	p {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: 13px;
		font-style: normal;
		font-weight: 400;
		line-height: 18px;
		letter-spacing: -0.39px;
	}
`;
