import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import UserTable from '@/components/Admin/UserTable';
import { getAdminBoards } from '@/pages/admin/board/BoardManageApi';

// 테이블 헤더용 목업 데이터 - API 응답에 맞게 수정
export const boardTableHeader = {
    authorId: '아이디',
    authorNickname: '닉네임', 
    title: '제목',
    createdAt: '날짜',
    manage: '관리'
};

function BoardManage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState([
		'authorId',
		'authorNickname',
		'title',
		'createdAt',
		'manage'
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const [boards, setBoards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const itemsPerPage = 20;

	// API에서 게시글 데이터 가져오기
	useEffect(() => {
		const fetchBoards = async () => {
			setLoading(true);
			try {
				const response = await getAdminBoards(currentPage - 1, itemsPerPage);
				
				if (response && response.content) {
					// API 데이터를 테이블 형식에 맞게 변환
					const transformedBoards = response.content.map(board => ({
						authorId: board.authorId,
						authorNickname: board.authorNickname,
						title: board.title,
						createdAt: new Date(board.createdAt).toLocaleDateString('ko-KR'),
						manage: `/admin/board/${board.boardId}`
					}));

					setBoards(transformedBoards);
					
					// 페이지네이션 처리
					setTotalPages(response.last ? response.number + 1 : response.number + 2);
				}
			} catch (error) {
				console.error('게시글 목록 조회 실패:', error);
				setBoards([]);
			} finally {
				setLoading(false);
			}
		};

		fetchBoards();
	}, [currentPage]);

	const filteredData = useMemo(() => {
		return boards.filter((board) =>
			Object.entries(board).some(
				([key, val]) =>
					visibleColumns.includes(key) &&
					String(val).toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}, [searchTerm, visibleColumns, boards]);

	const paginatedData = useMemo(() => {
		// 서버 사이드 페이지네이션을 사용하므로 클라이언트 사이드 페이지네이션 제거
		return filteredData;
	}, [filteredData]);

	// 페이지 변경 시 새로운 데이터 로드
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<Container>
			<Content>
				<TableArea>
					<BoardHeader
						title="게시판 관리"
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						buttonName="새로고침"
						onButtonClick={() => window.location.reload()}
					/>

					{loading ? (
						<LoadingMessage>로딩 중...</LoadingMessage>
					) : (
						<UserTable
							data={[boardTableHeader, ...paginatedData]}
							currentPage={currentPage}
							setCurrentPage={handlePageChange}
							totalPages={totalPages}
							visibleColumns={visibleColumns}
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

const LoadingMessage = styled.div`
	text-align: center;
	padding: 40px 0;
	font-size: 16px;
	color: #666;
`;