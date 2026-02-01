import styled from 'styled-components';
import UserTable from '@/components/Admin/UserTable';
import Search from '@/assets/icons/searchBlack.svg?react';
import { useMemo, useState } from 'react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

function AdminGallery() {
	function formatDateTime(isoString) {
		if (!isoString) return '';

		const date = new Date(isoString);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day} / ${hours}:${minutes}`;
	}

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 15;

	const headerRow = {
		title: '소극장 공연 이름',
		date: '사진 등록 날짜',
		id: '아이디',
		manage: '관리',
	};

	const {
		data: gallData,
		error,
		loading,
	} = useCustomFetch(
		`/admin/photoAlbum?page=${currentPage}&size=${itemsPerPage}`,
	);
	const {
		data: searchData,
		error: searchError,
		loading: searchLoading,
	} = useCustomFetch(`/admin/photoAlbum/search?keyword=${searchTerm}`);
	//console.log('searchData', searchData);

	console.log('data:', gallData);

	const apiRows = useMemo(() => {
		const source = searchTerm && searchData?.result ? searchData : gallData;
		if (!source || !source.result) return [];

		return source.result.content.map((item) => ({
			title: item.amateurShowName,
			date: formatDateTime(item.updatedAt),
			id: item.id,
			manage: `/admin/gallery/${item.id}`,
		}));
	}, [gallData, searchData, searchTerm]);

	//const photo_data = [headerRow, ...apiRows];
	const visibleColumns = ['title', 'date', 'id', 'manage'];

	const totalPages = searchTerm ? 1 : gallData?.result.totalPages;
	const isLast = gallData?.result.last;
	const isFirst = gallData?.result.first;
	
	const paginatedData = [headerRow, ...apiRows];

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
									setCurrentPage(0);
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
						isLast={isLast}
						isFirst={isFirst}
						visibleColumns={visibleColumns}
						loading={loading}
						searchLoading={searchLoading}
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
