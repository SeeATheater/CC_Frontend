import styled from 'styled-components';
import SearchBar from '@/components/SearchBar';
import SearchBoxBlack from '@/assets/icons/SearchBoxBlack.svg?react';
import SearchBarBlack from '../../../components/SearchBarBlack';
import SearchOptionBar from '../../../components/Admin/SearchOptionBar';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AdminListPage } from '@/pages/admin/STYLE/admin-list.style';
import Pagination from 'react-js-pagination';
function RegisterRequests() {
	const navigate = useNavigate();

	const testRequests = [
		{
			id: 'diama8843',
			name: '전시연',
			email: 'junsiyeon123654@gmail.com',
			phone: '010-1234-1234',
			title: '실종',
			status: '등록',
		},
	];

	const { data, loading, error } = useCustomFetch(
		'/admin/approval/showList?page=0&size=20',
		'GET',
	);

	const changePageHandler = (page) => {
		setPage(page);
	};
	const [stockList, setStockList] = useState([]);
	const [currentList, setCurrentList] = useState([]);

	useEffect(() => {
		if (data) {
			setStockList(data?.result?.content || data); // data 구조 맞게
		}
	}, [data]);

	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const indexOfLastItem = page * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	useEffect(() => {
		if (Array.isArray(stockList)) {
			setCurrentList(stockList.slice(indexOfFirstItem, indexOfLastItem));
		}
	}, [page, stockList]);

	return (
		<>
			<AdminListPage>
				<SectionTitle>등록 요청 관리</SectionTitle>
				<SearchOptionBar />
				<table>
					<thead>
						<tr>
							<th>아이디</th>
							<th>이름</th>
							<th>E-mail</th>
							<th>번호</th>
							<th>연극명</th>
							<th>등록</th>
							<th>관리</th>
						</tr>
					</thead>
					<tbody>
						{console.log(currentList)}
						{currentList.map((request, index) => (
							<tr key={request.showId || index}>
								<td>{request.showId}</td>
								<td>{request.username}</td>
								<td>{request.email}</td>
								<td>{request.phone}</td>
								<td>{request.showName}</td>
								<td>{request.amateurStatus}</td>
								<td>
									<button
										onClick={() => {
											localStorage.setItem('detail', JSON.stringify(request));
											navigate(`${request.showId}`);
										}}
									>
										상세
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Pagination
					activePage={page}
					itemsCountPerPage={itemsPerPage}
					totalItemsCount={stockList.length}
					className="pagination"
					pageRangeDisplayed={5}
					onChange={changePageHandler}
				/>
			</AdminListPage>
		</>
	);
}
export default RegisterRequests;

const SectionTitle = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 12px;
`;
