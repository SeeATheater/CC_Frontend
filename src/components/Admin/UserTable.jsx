import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';

const UserTable = ({
	data,
	currentPage,
	setCurrentPage,
	totalPages,
	visibleColumns,
	isLast,
	isFirst,
	hasNext,
	loading,
	searchLoading,
}) => {
	const navigate = useNavigate();

	const allHeaders = Object.keys(data[0] ?? {});

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
										<StyledTd>
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

			<Pagination>
				<PageBtn
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={isFirst || currentPage === 0}
				>
					<ChevronLeftGray />
				</PageBtn>

				{Array.from({ length: totalPages }, (_, i) => (
					<PageBtn
						key={i}
						onClick={() => setCurrentPage(i)}
						active={currentPage === i}
					>
						{i + 1}
					</PageBtn>
				))}

				<PageBtn
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={
						isLast === true ||
						hasNext === false ||
						currentPage + 1 === totalPages
					}
				>
					<ChevronRightGray />
				</PageBtn>
			</Pagination>
		</Wrapper>
	);
};

export default UserTable;

const ChevronLeftGray = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.gray400};
	height: 16px;
`;
const ChevronRightGray = styled(ChevronRight)`
	color: ${({ theme }) => theme.colors.gray400};
	height: 16px;
`;
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
`;

const Pagination = styled.div`
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

const PageBtn = styled.button`
	padding: 6px 10px;
	border-radius: 4px;
	border: none;
	font-size: ${({ theme, active }) =>
		active ? theme.font.fontSize.title16 : theme.font.fontSize.body14};
	color: ${({ active }) => (active ? '#000' : '#989898')};
	cursor: pointer;
`;
