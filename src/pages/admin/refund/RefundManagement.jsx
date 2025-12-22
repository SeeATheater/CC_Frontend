import styled from 'styled-components';
import SearchBar from '@/components/SearchBar';
import SearchBoxBlack from '@/assets/icons/SearchBoxBlack.svg?react';
import SearchBarBlack from '@/components/SearchBarBlack';
import SearchOptionBar from '@/components/Admin/SearchOptionBar';
import SubNav from '@/components/Admin/SubNav';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AdminListPage } from '@/pages/admin/STYLE/admin-list.style';
import Pagination from 'react-js-pagination';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
function RefundManagement() {
	const requests = [
		{
			userId: 'diana8443',
			name: '전시연',
			title: '실종',
			date: '2025-01-09 / 14:50',
			requestDate: '2024.01.24 / 17:59',
			id: 1,
		},
	];
	const navigate = useNavigate();

	const [searchKeyword, setSearchKeyword] = useState('');

	const [page, setPage] = useState(0);
	const size = 20;

	const url = `/admin/ticket/refund/history?page=${page}&size=${size}${
		searchKeyword ? `&keyword=${searchKeyword}` : ''
	}`;

	const { data, loading, error } = useCustomFetch(url, 'GET');

	const [list, setList] = useState([]);

	useEffect(() => {
		if (data) {
			setList(data?.result?.content || []);
		}
	}, [data]);
	console.log('데데이터터', data);
	const changePageHandler = (pageNum) => {
		setPage(pageNum - 1);
	};

	function formatDateTime(isoString) {
		if (!isoString) return '-';
		const d = new Date(isoString);

		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');

		return `${year}.${month}.${day} / ${hours}:${minutes}`;
	}
	return (
		<>
			<AdminListPage>
				<SectionTitle>소극장 공연 관리</SectionTitle>
				<SubNav page={'refunds'} />
				<SearchOptionBar onSearch={setSearchKeyword} />
				<table>
					<thead>
						<tr>
							<th>아이디</th>
							<th>이름</th>
							<th>소극장 공연 이름</th>
							<th>날짜/시간</th>
							<th>환불 신청 날짜/시간</th>
							<th>관리</th>
						</tr>
					</thead>
					<tbody>
						{list &&
							list.map((request) => (
								<tr key={request.realTicketId}>
									{console.log(request)}
									<td>{request.username}</td>
									<td>{request.memberName}</td>
									<td>{request.showTitle}</td>
									<td>{formatDateTime(request.performanceDateTime)}</td>
									<td>{formatDateTime(request.canceledAt)}</td>
									<td>
										<button onClick={() => navigate(`${request.showId}`)}>
											상세
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<Pagination
					activePage={page + 1 || 1}
					itemsCountPerPage={size}
					totalItemsCount={data?.result?.numberOfElements}
					pageRangeDisplayed={5}
					onChange={changePageHandler}
				/>
			</AdminListPage>
		</>
	);
}
export default RefundManagement;

const SectionTitle = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 12px;
`;
