import { useMemo, useState } from 'react';
import styled from 'styled-components';

import UserTable from '@/components/Admin/UserTable';
import Search from '@/assets/icons/searchBlack.svg?react';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import { formatDateTime } from './BoardManageApi';

function BoardManage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 10;

	// 테이블 헤더
	const headerRow = {
		authorNickname: '작성자',
		title: '제목',
		createdAt: '작성일시',
		manage: '관리',
	};

	// 
	const searchParam = searchTerm ? `&keyword=${encodeURIComponent(searchTerm)}` : '';
	const {
		data: boardData,
		error,
		loading,
	} = useCustomFetch(
		`/admin/boards?page=${currentPage}&size=${itemsPerPage}${searchParam}`,
	);

	// API 데이터 변환
	const apiRows = useMemo(() => {
		// boardData.content에 직접 배열이 있음 
		if (!boardData || !boardData.content || !Array.isArray(boardData.content)) {
			return [];
		}
		
		return boardData.content.map((board) => ({
			authorNickname: board.authorNickname || '익명',
			title: board.title || '',
			createdAt: formatDateTime(board.createdAt),
			manage: `/admin/board/${board.boardId}`,
		}));
	}, [boardData]);

	// 페이지네이션된 데이터
	const paginatedData = useMemo(() => {
		return [headerRow, ...apiRows];
	}, [apiRows]);

	// 페이지네이션 정보 - 수정필요 (미완)
	const isLast = boardData?.last ?? false;
	const isFirst = boardData?.first ?? true;
	const pageNumber = boardData?.number ?? 0;
	// totalPages가 없어서 동적으로 계산
	// 마지막 페이지면 현재 페이지 + 1, 아니면 현재 + 5로 설정 (임시)
	const totalPages = isLast ? pageNumber + 1 : pageNumber + 5;

	// 컬럼 표시 설정
	const visibleColumns = ['authorNickname', 'title', 'createdAt', 'manage'];

	return (
		<Container>
			<Content>
				<TableArea>
					<Title>게시판 관리</Title>
					
					<FilterArea>
						<SearchInput>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setCurrentPage(0); // 검색 시 첫 페이지로
								}}
								placeholder="검색어를 입력하세요"
							/>
							<Search width={15} />
						</SearchInput>
					</FilterArea>

					{loading ? (
						<LoadingMessage>로딩 중...</LoadingMessage>
					) : error ? (
						<ErrorMessage>데이터를 불러오는 중 오류가 발생했습니다.</ErrorMessage>
					) : apiRows.length === 0 ? (
						<EmptyMessage>게시글이 없습니다.</EmptyMessage>
					) : (
						<UserTable
							data={paginatedData}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							isLast={isLast}
							isFirst={isFirst}
							visibleColumns={visibleColumns}
							loading={loading}
						/>
					)}
				</TableArea>
			</Content>
		</Container>
	);
}

export default BoardManage;

const Container = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
`;

const Content = styled.div`
	width: 100%;
	display: flex;
`;

const TableArea = styled.div`
	padding: 0px 120px 50px 50px;
	width: 100%;
`;

const Title = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
`;

const FilterArea = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 36px;
`;

const SearchInput = styled.div`
	display: flex;
	align-items: center;
	padding: 0 10px;
	background: #fff;
	width: 360px;
	height: 32px;
	border-radius: 7px;
	border: 1px solid #000;

	input {
		width: 100%;
		border: none;
		outline: none;
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};

		&::placeholder {
			color: ${({ theme }) => theme.colors.gray400};
		}
	}
`;

const LoadingMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: #666;
`;

const ErrorMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: #f00;
`;

const EmptyMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: #999;
`;
