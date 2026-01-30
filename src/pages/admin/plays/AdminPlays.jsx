import styled from 'styled-components';
import UserTable from '@/components/Admin/UserTable';
import FilterHeader from '@/components/Admin/FilterHeader';

import { useState, useMemo } from 'react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

function AdminPlays() {
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 15;
	const [searchTerm, setSearchTerm] = useState('');

	const headerRow = {
		showName: '소극장 공연 이름',
		createdAt: '날짜/시간',
		performerName: '등록자명',
		amateurShowStatus: '상태',
		manage: '관리',
	};

	const apiUrl = searchTerm
		? `/admin/amateurShow/showList?page=${currentPage}&size=${itemsPerPage}&keyword=${searchTerm}`
		: `/admin/amateurShow/showList?page=${currentPage}&size=${itemsPerPage}`;

	const {
		data: playData,
		error: playError,
		loading: playLoading,
	} = useCustomFetch(apiUrl);

	console.log(playData)

	const apiRows = useMemo(() => {
		if (!playData || !playData.result.content) return [];
		return playData?.result?.content.map((item) => ({
			showName: item.showName,
			createdAt: item.createdAt,
			performerName: item.performerName,
			amateurShowStatus: item.amateurShowStatus,
			manage: `/admin/plays/${item.showId}`,
		}));
	}, [playData]);

	const [visibleColumns, setVisibleColumns] = useState([
		'showName',
		'createdAt',
		'performerName',
		'amateurShowStatus',
		'manage',
	]);

	const filterKeys = ['showName', 'createdAt', 'performerName'];
	const filterLabels = {
		showName: '공연 이름',
		createdAt: '날짜/시간',
		performerName: '등록자명',
	};

	//소극장 api에는 페이지네이션 정보 없음
	const totalPages = playData?.result.totalPages;
	const isLast = playData?.result.last;
	const isFirst = playData?.result.first;
	const hasNext = playData?.result.hasNext

	const paginatedData = [headerRow, ...apiRows];

	//const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	return (
		<Container>
			<Content>
				<TableArea>
					<FilterHeader
						title="소극장 공연 관리"
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						filterKeys={filterKeys}
						filterLabels={filterLabels}
						visibleColumns={visibleColumns}
						setVisibleColumns={setVisibleColumns}
					/>

					<UserTable
						data={paginatedData}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						isLast={isLast}
						isFirst={isFirst}
						hasNext={hasNext}
						visibleColumns={visibleColumns}
					/>
				</TableArea>
			</Content>
		</Container>
	);
}

export default AdminPlays;

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
