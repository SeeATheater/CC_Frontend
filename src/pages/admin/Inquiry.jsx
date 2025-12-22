import { useMemo, useState } from 'react';
import styled from 'styled-components';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import FilterHeader from '@/components/Admin/FilterHeader';
import UserTable from '@/components/Admin/UserTable';

function Inquiry() {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 10;

	const apiUrl = searchTerm
		? `/admin/inquiry?keyword=${searchTerm}&page=${currentPage}&size=${itemsPerPage}`
		: `/admin/inquiry?page=${currentPage}&size=${itemsPerPage}`;

	const {
		data: inquiryData,
		error: inquiryError,
		loading: inquiryLoading,
	} = useCustomFetch(apiUrl);
	console.log(inquiryData?.result);

	function formatDate(dateString) {
		const date = new Date(dateString);

		const year = date.getFullYear();
		const month = date.getMonth() + 1; // 0부터 시작하므로 +1
		const day = date.getDate();

		const hours = date.getHours();
		const minutes = date.getMinutes();

		const m = month.toString().padStart(2, '0');
		const d = day.toString().padStart(2, '0');
		const h = hours.toString().padStart(2, '0');
		const min = minutes.toString().padStart(2, '0');

		return `${year}.${m}.${d} / ${h}:${min}`;
	}

	const headerRow = {
		content: '문의',
		userId: '아이디',
		email: '이메일',
		manage: '관리',
		date: '날짜/시간(최신순)',
		situation: '진행도',
	};

	const apiRows = useMemo(() => {
		if (!inquiryData || !inquiryData.result) return [];
		return inquiryData.result.inquiryList.map((item) => ({
			content: item.title,
			userId: item.userName,
			email: item.email,
			manage: `/admin/inquiry/${item.inquiryId}`,
			date: formatDate(item.createdAt),
			situation: item.inquiryStatus,
		}));
	}, [inquiryData]);

	const [visibleColumns, setVisibleColumns] = useState([
		'content',
		'userId',
		'email',
		'manage',
		'date',
		'situation',
	]);

	const handleColumnToggle = (column) => {
		setVisibleColumns((prev) =>
			prev.includes(column)
				? prev.filter((c) => c !== column)
				: [...prev, column],
		);
	};
	const paginatedData = [headerRow, ...apiRows];

	const filterKeys = ['email', 'date', 'situation'];
	const filterLabels = {
		email: 'E-mail',
		id: '번호',
		date: '날짜/시간(최신순)',
		situation: '진행도',
	};

	const totalPages = inquiryData?.result.totalPages;
	//문의 api에는 totalPages 정보 없음 (hasNext만)
	const isLast = inquiryData?.result.last;
	const isFirst = inquiryData?.result.first;

	return (
		<Container>
			<Content>
				<TableArea>
					<FilterHeader
						title="문의"
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
						visibleColumns={visibleColumns}
					/>
				</TableArea>
			</Content>
		</Container>
	);
}

export default Inquiry;

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
