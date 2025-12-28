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

	const navigate = useNavigate();

	const [searchKeyword, setSearchKeyword] = useState('');

	const [page, setPage] = useState(0);
	const size = 20;

	const url = `/admin/approval/showList?page=${page}&size=${size}${
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
	return (
		<>
			<AdminListPage>
				<SectionTitle>등록 요청 관리</SectionTitle>
				<SearchOptionBar onSearch={setSearchKeyword} />
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
						{console.log(list)}
						{list &&
							list.map((request, index) => (
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
					activePage={page + 1}
					itemsCountPerPage={size}
					totalItemsCount={data?.result?.numberOfElements}
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
