import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Poster from '@/assets/images/test-poster1.png';
import { useNavigate } from 'react-router-dom';

function Ranking({ data }) {
	const listRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
const [hasMoved, setHasMoved] = useState(false);
const navigate = useNavigate();
	// 자동 스크롤
	useEffect(() => {
		const interval = setInterval(() => {
			if (listRef.current && !isDragging) {
				if (
					listRef.current.scrollLeft >=
					listRef.current.scrollWidth - listRef.current.clientWidth
				) {
					listRef.current.scrollLeft = 0; // 처음 위치로 이동
				} else {
					listRef.current.scrollLeft += 1;
				}
			}
		}, 20);
		return () => clearInterval(interval);
	}, [isDragging]);

	// 드래그 이벤트
const handleMouseDown = (e) => {
	setIsDragging(true);
	setHasMoved(false);
	setStartX(e.pageX - listRef.current.offsetLeft);
	setScrollLeft(listRef.current.scrollLeft);
};
	const handleMouseMove = (e) => {
	if (!isDragging) return;

	const x = e.pageX - listRef.current.offsetLeft;
	const walk = x - startX;

	if (Math.abs(walk) > 5) {
		setHasMoved(true);
	}

	listRef.current.scrollLeft = scrollLeft - walk;
};
	const handleMouseUp = () => {
	setIsDragging(false);
};
	const handleMouseLeave = () => setIsDragging(false);

	return (
		<Wrapper>
			<CardList
				ref={listRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={(e) => handleMouseDown(e.touches[0])}
				onTouchMove={(e) => handleMouseMove(e.touches[0])}
				onTouchEnd={handleMouseUp}
			>
				{[...data, ...data].map((item, index) => (
					<Card key={item.roundId}
					onClick={() => {
						if (hasMoved) return; // 드래그였으면 클릭 무시
						navigate(`/plays/detail/${item.amateurShowId}`);
					}}>
						<Img background={item.posterImageUrl}>
							<IndexLabel>{(index % data.length) + 1}</IndexLabel>
						</Img>
						<h3>{item.name}</h3>
						<p>{item.place}</p>
						<p className="extra">{item.schedule}</p>
					</Card>
				))}
			</CardList>
		</Wrapper>
	);
}

export default Ranking;

const Wrapper = styled.div``;
const Card = styled.div`
	width: 128px;
	@media (min-width: 768px) {
		width: 200px;
	}
		transition: transform 0.05s ease, box-shadow 0.05s ease;
&:hover {
		transform: scale(1.05);
	}

	/* 드래그 중엔 커지지 않게 (선택) */
	${({ isDragging }) =>
		isDragging &&
		`
		transform: scale(1);
	`}
	h3 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		margin-bottom: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
		}
	}
	p {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.body14};
		}
	}
	.extra {
		color: ${({ theme }) => theme.colors.gray400};
	}
`;
const Img = styled.div`
	position: relative;
	width: 128px;
	height: 180px;
	border-radius: 3px;
	background:
		linear-gradient(180deg, rgba(0, 0, 0, 0) 50.58%, rgba(0, 0, 0, 0.5) 100%),
		url(${({ background }) => background}) center/cover no-repeat;
	margin-bottom: 12px;
	@media (min-width: 768px) {
		width: 200px;
		height: 280px;
		border-radius: 5px;
	}
`;
const IndexLabel = styled.div`
	position: absolute;
	bottom: 12px;
	left: 12px;
	color: ${({ theme }) => theme.colors.grayWhite};
	font-size: ${({ theme }) => theme.font.fontSize.headline20};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	@media (min-width: 768px) {
		font-size: 36px;
	}
`;
const CardList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px;
	overflow-x: auto;
	padding-top: 10px;
	padding-bottom:10px;
	padding-bottom: 8px; /* 스크롤 안 보이게 여유 */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE/Edge */
	@media (min-width: 768px) {
		gap: 28px;
	}
	&::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}
	cursor: grab;
	user-select: none;
`;
