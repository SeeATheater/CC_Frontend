import { useMemo, useState } from 'react';
import styled from 'styled-components';

import FilterHeader from '@/components/Admin/FilterHeader';
import UserTable from '@/components/Admin/UserTable';

function Inquiry() {
	const inquiry_data = [
		{
			content: '문의',
			userId: '아이디',
			email: 'E-mail',
			manage: '문의 내용',
			date: '날짜/시간(최신순)',
			situation: '진행도',
			id: 0,
		},
		{
			content: '2매 구매했는데 표는 어떻게 가져가나요?',
			userId: 'diana8443',
			email: ' junsiyeon123654@gmail.com',
			manage: '/admin/inquiry/',
			date: '2024.01.18 / 14:00',
			situation: '미완료',
			id: 1,
		},
		{
			content: '2매 구매했는데 표는 어떻게 가져가나요?',
			userId: 'diana8443',
			email: ' junsiyeon123654@gmail.com',
			manage: '/admin/inquiry/',
			date: '2024.01.18 / 14:00',
			situation: '미완료',
			id: 2,
		},
		{
			content: '2매 구매했는데 표는 어떻게 가져가나요?',
			userId: 'diana8443',
			email: ' junsiyeon123654@gmail.com',
			manage: '/admin/inquiry/',
			date: '2024.01.18 / 14:00',
			situation: '미완료',
			id: 3,
		},
	];

	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState([
		'content',
		'userId',
		'email',
		'manage',
		'date',
		'situation',
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	const filterKeys = ['email', 'date', 'situation'];
	const filterLabels = {
		email: 'E-mail',
		id: '번호',
		date: '날짜/시간(최신순)',
		situation: '진행도',
	};
	const filteredData = useMemo(() => {
		const content = inquiry_data.slice(1);
		return content.filter((user) =>
			Object.entries(user).some(
				([key, val]) =>
					visibleColumns.includes(key) &&
					val.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}, [searchTerm, visibleColumns, inquiry_data]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(start, start + itemsPerPage);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	
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
						data={[inquiry_data[0], ...paginatedData]}
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
