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

function ReservationManagement() {
	const requests = [
		{
			id: '1',
			name: '전시연',
			title: '실종',
			date: '2025-01-09 / 14:50',
			place: '홍대',
			count: '1',
			status: '예약 중',
		},
	];
	const navigate = useNavigate();

	const [searchKeyword, setSearchKeyword] = useState('');
	const [page, setPage] = useState(0);
	const size = 20;

	const url = `/admin/ticket/reservation/history?page=${page}&size=${size}${
		searchKeyword ? `&keyword=${searchKeyword}` : ''
	}`;

	const { data, loading, error } = useCustomFetch(url, 'GET');

	const [list, setList] = useState([]);

	useEffect(() => {
		if (data) {
			setList(data?.result?.content || []);
		}
	}, [data]);

	const changePageHandler = (pageNum) => {
		setPage(pageNum - 1);
	};

	function formatDateTime(isoString) {
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
				<SubNav page={'reservations'} />
				<SearchOptionBar onSearch={setSearchKeyword} />
				<table>
					<thead>
						<tr>
							<th>예약자명</th>
							<th>소극장 공연 이름</th>
							<th>날짜/시간</th>
							<th>공연 장소</th>
							<th>매수</th>
							<th>상태</th>
							<th>관리</th>
						</tr>
					</thead>
					<tbody>
						{list &&
							list.map((request, index) => (
								<tr key={request.realTicketId || index}>
									<td>{request.reserverName}</td>
									<td>{request.showTitle}</td>
									<td>{formatDateTime(request.performanceDateTime)}</td>
									<td>{request.detailAddress}</td>
									<td>{request.quantity}매</td>
									<td>{request.status}</td>
									<td>
										<button
											onClick={() => {
												navigate(`${request.realTicketId}`);
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
					activePage={page + 1}
					itemsCountPerPage={size}
					totalItemsCount={data?.result?.numberOfElements}
					className="pagination"
					pageRangeDisplayed={5}
					onChange={changePageHandler}
				/>
			</AdminListPage>
		</>
	);
}
export default ReservationManagement;

const SectionTitle = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 12px;
`;
