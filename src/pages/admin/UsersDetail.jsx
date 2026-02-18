import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

import styled from 'styled-components';
import Search from '@/assets/icons/searchBlack.svg?react';
import SearchBg from '@/assets/icons/searchBlackBg.svg?react';

function UsersDetail() {
	const { userId } = useParams();
	const { fetchData } = useCustomFetch();

	const {
		data: userData,
		error: userError,
		loading: userLoading,
	} = useCustomFetch(`/admin/member/${userId}`);
	//console.log('userData', userData);

	const safeValue = (val) =>
		val === null || val === undefined || val === '' ? ' ' : val;

	const [isEditing, setIsEditing] = useState(false);

	const [editValues, setEditValues] = useState({
		memberId: userId,
		username: '',
		name: '',
		phone: '',
		email: '',
		birth_date: '',
		gender: '',
		address: '',
	});

	useEffect(() => {
		if (userData?.result) {
			setEditValues({
				memberId: userData.result.memberId ?? userId,
				username: userData.result.username ?? '',
				name: userData.result.name ?? '',
				phone: userData.result.phone ?? '',
				email: userData.result.email ?? '',
				birth_date: userData.result.birth_date ?? '',
				gender: userData.result.gender ?? '',
				address: userData.result.address ?? '',
			});
		}
	}, [userData]);

	const rows = [
		{ key: 'username', label: '아이디', value: safeValue(editValues.username) },
		{ key: 'name', label: '이름', value: safeValue(editValues.name) },
		{ key: 'phone', label: '번호', value: safeValue(editValues.phone) },
		{ key: 'email', label: 'E-mail', value: safeValue(editValues.email) },
		{
			key: 'birth_date',
			label: '생년월일',
			value: safeValue(editValues.birth_date),
		},
		{ key: 'gender', label: '성별', value: safeValue(editValues.gender) },
		{ key: 'address', label: '주소', value: safeValue(editValues.address) },
	];

	const labelMap = {
		username: '아이디',
		name: '이름',
		phone: '번호',
		email: 'E-mail',
		birth_date: '생년월일',
		gender: '성별',
		address: '주소',
	};

	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState([
		'username',
		'name',
		'phone',
		'email',
		'birth_date',
		'gender',
		'address',
	]);

	const handleColumnToggle = (column) => {
		setVisibleColumns((prev) =>
			prev.includes(column)
				? prev.filter((c) => c !== column)
				: [...prev, column],
		);
	};

	const filteredRows = useMemo(() => {
		return rows.filter(
			(row) =>
				visibleColumns.includes(row.key) &&
				row.value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [searchTerm, visibleColumns, editValues]);

	const handleInputChange = (key, value) => {
		setEditValues((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		try {
			const response = await fetchData(
				`/admin/member/${userId}`,
				'PUT',
				JSON.stringify(editValues),
			);
			if (!response.data.isSuccess) {
				console.log(response);
				throw new Error('수정 실패');
			}
			setIsEditing(false);
		} catch (error) {
			console.error(error);
			//console.log(editValues);
			alert('수정 중 오류가 발생했습니다.');
		}
	};

	return (
		<Container>
			<Content>
				<SectionTitle>사용자 관리</SectionTitle>

				<FilterArea>
					<SearchInput>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Search width={15} />
					</SearchInput>
					<div className="checkboxArea">
						{Object.entries(labelMap).map(([key, label]) => (
							<label key={key}>
								<input
									type="checkbox"
									checked={visibleColumns.includes(key)}
									onChange={() => handleColumnToggle(key)}
								/>
								{label}
							</label>
						))}
						<SearchBg />
					</div>
				</FilterArea>

				<Table>
					<Title>{'<'} 기본 정보</Title>
					<tbody>
						{filteredRows.map((row, index) => (
							<tr key={index}>
								<th>{row.label}</th>
								<td>
									{isEditing ? (
										<input
											type="text"
											value={editValues[row.key] ?? ''}
											onChange={(e) =>
												handleInputChange(row.key, e.target.value)
											}
										/>
									) : (
										row.value
									)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
					{isEditing ? '수정완료' : '수정하기'}
				</Button>
			</Content>
		</Container>
	);
}

export default UsersDetail;

const Container = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
`;
const Content = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 0px 120px 50px 50px;
`;

const Title = styled.h2`
	color: #000;
	text-align: left;
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	margin-bottom: 26px;
`;
const Table = styled.div`
	width: 600px;
	display: flex;
	margin: 0 auto;
	flex-direction: column;
	padding-top: 120px;

	border-collapse: collapse;
	th {
		text-align: center;
		width: 120px;
		padding: 6px 20px;
		border: 1px solid #ddd;
		border-left: none;

		color: #8f8e94;
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
	}

	td {
		text-align: left;
		width: 480px;
		padding: 6px 20px;
		border: 1px solid #ddd;
		border-right: none;

		color: #424242;
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
	}

	margin-bottom: 80px;
`;

const Button = styled.button`
	align-self: flex-end;
	width: 156px;
	height: 38px;
	border-radius: 8px;
	background: var(--color-pink-100, #fff7f5);
    font-size: font-size: ${({ theme }) => theme.font.fontSize.title16};
    font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink600};
`;
const SectionTitle = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
`;
const FilterArea = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 36px;

	.checkboxArea {
		display: flex;
		align-items: center;
		gap: 18px;
	}
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
