import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';

const BoardTable = ({
	data,
	currentPage,
	setCurrentPage,
	totalPages,
	visibleColumns,
	loading,
}) => {
	const navigate = useNavigate();
	const BLOCK_SIZE = 5; // 한 블록에 표시할 페이지 수

	const allHeaders = Object.keys(data[0] ?? {});

	// 현재 페이지가 속한 블록 계산
	const currentBlock = Math.floor(currentPage / BLOCK_SIZE);
	
	// 현재 블록의 시작/끝 페이지
	const blockStartPage = currentBlock * BLOCK_SIZE;
	const blockEndPage = Math.min(blockStartPage + BLOCK_SIZE - 1, totalPages - 1);
	
	// 표시할 페이지 번호 배열 생성
	const pageNumbers = [];
	for (let i = blockStartPage; i <= blockEndPage; i++) {
		pageNumbers.push(i);
	}
	
	// 이전/다음 블록 존재 여부
	const hasPrevBlock = currentBlock > 0;
	const hasNextBlock = blockEndPage < totalPages - 1;
	
	// 이전 블록의 첫 페이지로 이동
	const goToPrevBlock = () => {
		if (hasPrevBlock) {
			const prevBlockStart = (currentBlock - 1) * BLOCK_SIZE;
			setCurrentPage(prevBlockStart);
		}
	};
	
	// 다음 블록의 첫 페이지로 이동
	const goToNextBlock = () => {
		if (hasNextBlock) {
			const nextBlockStart = (currentBlock + 1) * BLOCK_SIZE;
			setCurrentPage(nextBlockStart);
		}
	};

	return (
		<Wrapper>
			<StyledTable>
				<thead>
					<tr>
						{allHeaders.map((key) =>
							visibleColumns.includes(key) || key === 'manage' ? (
								<th key={key}>{data[0][key]}</th>
							) : null,
						)}
					</tr>
				</thead>
				<tbody>
					{data.slice(1).map((row, idx) => (
						<tr key={idx}>
							{allHeaders.map((key) => {
								if (!visibleColumns.includes(key) && key !== 'manage')
									return null;

								if (key === 'manage') {
									return (
										<StyledTd key={key}>
											<DetailButton onClick={() => navigate(row.manage)}>
												상세
											</DetailButton>
										</StyledTd>
									);
								}
								if (key === 'amateurShowStatus') {
									return (
										<StyledTd key={key}>
											{row.amateurShowStatus === 'ONGOING' && (
												<p className="black-txt">공연중</p>
											)}
											{row.amateurShowStatus === 'ENDED' && (
												<p className="gray-txt">공연 종료</p>
											)}
											{row.amateurShowStatus === 'YET' && (
												<p className="pink-txt">공연 전</p>
											)}
										</StyledTd>
									);
								}

								return <StyledTd key={key}>{row[key]}</StyledTd>;
							})}
						</tr>
					))}
				</tbody>
			</StyledTable>

			{/* 블록 단위 페이지네이션 */}
			<Pagination>
				{/* 이전 블록 버튼 */}
				<PageBtn
					onClick={goToPrevBlock}
					disabled={!hasPrevBlock}
					isArrow
				>
					<ChevronLeftIcon />
				</PageBtn>

				{/* 페이지 번호들 */}
				{pageNumbers.map((pageNum) => (
					<PageBtn
						key={pageNum}
						onClick={() => setCurrentPage(pageNum)}
						active={currentPage === pageNum}
					>
						{pageNum + 1}
					</PageBtn>
				))}

				{/* 다음 블록 버튼 */}
				<PageBtn
					onClick={goToNextBlock}
					disabled={!hasNextBlock}
					isArrow
				>
					<ChevronRightIcon />
				</PageBtn>
			</Pagination>
		</Wrapper>
	);
};

export default BoardTable;

const Wrapper = styled.div`
	font-family: Pretendard;
`;

const StyledTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	th,
	td {
		height: 31px;
	}
	th {
		border: 1px solid #000;
		text-align: center;
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
	td {
		border: 1px solid #000;
		text-align: center;
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;

const StyledTd = styled.td`
	.black-txt {
		color: ${({ theme }) => theme.colors.grayMain};
	}
	.gray-txt {
		color: ${({ theme }) => theme.colors.gray400};
	}
	.pink-txt {
		color: ${({ theme }) => theme.colors.pink600};
	}
`;

const DetailButton = styled.button`
	width: 39px;
	height: 20px;
	font-size: 10px;
	border: none;
	background-color: #d9d9d9;
	color: #555;
	cursor: pointer;
	
	&:hover {
		background-color: #bbb;
	}
`;

const Pagination = styled.div`
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

const PageBtn = styled.button`
	padding: ${({ isArrow }) => (isArrow ? '6px 12px' : '6px 10px')};
	border-radius: 4px;
	border: none;
	font-size: ${({ theme, active }) =>
		active ? theme.font.fontSize.title16 : theme.font.fontSize.body14};
	font-weight: ${({ active }) => (active ? '700' : '400')};
	color: ${({ active, disabled }) => 
		disabled ? '#ccc' : active ? '#000' : '#989898'};
	cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
	transition: all 0.2s;
	
	&:hover:not(:disabled) {
		background-color: ${({ active, theme }) => 
			active ? theme.colors.pink100 || '#FFF1EF' : '#f8f8f8'};
	}
	
	&:disabled {
		opacity: 0.3;
	}
`;

const ChevronLeftIcon = styled(ChevronLeft)`
  color: ${({ theme }) => theme.colors.gray400};
  height: 16px;
  width: 16px;
`;

const ChevronRightIcon = styled(ChevronRight)`
  color: ${({ theme }) => theme.colors.gray400};
  height: 16px;
  width: 16px;
`;