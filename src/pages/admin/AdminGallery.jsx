import styled from 'styled-components';
import UserTable from '@/components/Admin/UserTable';
import Search from '@/assets/icons/searchBlack.svg?react';
import { useState } from 'react';

function AdminGallery() {
	const photo_data = [
		{
			title: '소극장 공연 이름',
			date: '사진 등록 날짜',
			id: '아이디',
			manage: '관리',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
		{
			title: '실종',
			date: '2025-01-09 / 14:50',
			id: 'cc1234',
			manage: '/admin/gallery/',
		},
	];
	const visibleColumns = ['title', 'date', 'id', 'manage'];

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;
	const totalPages = Math.ceil((photo_data.length - 1) / itemsPerPage);
	const paginatedData = photo_data
		.slice(0, 1)
		.concat(
			photo_data
				.slice(1)
				.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
		);

	return (
		<Container>
			<Content>
				<TableArea>
					<Title>사진첩 관리</Title>
					<div className="serachNadd">
						<SearchInput>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setCurrentPage(1);
								}}
								placeholder="검색어를 입력하세요"
							/>
							<Search width={15} />
						</SearchInput>
						<Button>추가하기</Button>
					</div>
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

export default AdminGallery;

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

	.serachNadd {
		display: flex;
		justify-content: space-between;
		margin-bottom: 70px;
	}
`;
const Title = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
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
	}
`;

const Button = styled.button`
	padding: 8px 20px;
	border-radius: 3px;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};
	color: ${({ theme }) => theme.colors.grayWhite};
	background-color: ${({ theme }) => theme.colors.pink600};
`;
