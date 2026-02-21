import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Search from '@/assets/icons/searchBlack.svg?react';
import SearchBg from '@/assets/icons/searchBlackBg.svg?react';

function PlaysDetail() {
	const { playId } = useParams();
	const { fetchData } = useCustomFetch();

	const editableKeys = ['hashTag', 'summary', 'account', 'contact'];

	const {
		data: playDetailData,
		error: playError,
		loading: playLoading,
	} = useCustomFetch(`/admin/amateurShow/${playId}`);
	console.log(playDetailData);
	//playDetailData.result.showStatus

	const safeValue = (val) =>
		val === null || val === undefined || val === '' ? ' ' : val;

	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState({
		showName: '',
		performerName: '',
		showId: '',
		createdAt: '',
		hashTag: '',
		summary: '',
		account: '',
		contact: '',
		showStatus: '',
	});

	useEffect(() => {
		if (playDetailData?.result) {
			setEditValues({
				showName: playDetailData.result.showName ?? '',
				performerName: playDetailData.result.performerName ?? '',
				showId: playDetailData.result.showId ?? '',
				createdAt: playDetailData.result.createdAt ?? '',
				hashTag: playDetailData.result.hashTag ?? '',
				summary: playDetailData.result.summary ?? '',
				account: playDetailData.result.account ?? '',
				contact: playDetailData.result.contact ?? '',
				showStatus: playDetailData.result.showStatus ?? '',
			});
		}
	}, [playDetailData]);

	const rows = [
		{
			key: 'showName',
			label: '소극장 공연 이름',
			value: safeValue(editValues.showName),
		},
		{
			key: 'performerName',
			label: '등록자명',
			value: safeValue(editValues.performerName),
		},
		{ key: 'showId', label: '아이디', value: safeValue(editValues.showId) },
		{ key: 'createdAt', label: '날짜', value: safeValue(editValues.createdAt) },
		{ key: 'hashTag', label: '해시태그', value: safeValue(editValues.hashTag) },
		{ key: 'summary', label: '줄거리', value: safeValue(editValues.summary) },
		{ key: 'account', label: '계좌번호', value: safeValue(editValues.account) },
		{ key: 'contact', label: '연락처', value: safeValue(editValues.contact) },
		{
			key: 'showStatus',
			label: '상태',
			value: safeValue(editValues.showStatus),
		},
	];

	const filterLabelMap = {
		showName: '공연이름',
		performerName: '등록자이름',
		createdAt: '날짜',
	};

	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState(
		Object.keys(filterLabelMap),
	);

	const handleColumnToggle = (column) => {
		setVisibleColumns((prev) =>
			prev.includes(column)
				? prev.filter((c) => c !== column)
				: [...prev, column],
		);
	};
	const filteredRows = useMemo(() => {
		return rows.filter((row) => {
			if (Object.keys(filterLabelMap).includes(row.key)) {
				return (
					visibleColumns.includes(row.key) &&
					row.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
				);
			}
			return true;
		});
	}, [searchTerm, visibleColumns, editValues]);

	const handleInputChange = (key, value) => {
		setEditValues((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		try {
			const response = await fetchData(
				`/admin/amateurShow/${playId}/revise`,
				'PATCH',
				JSON.stringify(editValues),
			);
			if (!response?.data.isSuccess) {
				throw new Error('수정 실패');
			}
			setIsEditing(false);
		} catch (error) {
			console.error(error);
			alert('수정 중 오류가 발생했습니다.');
		}
	};

	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};
	const goReview = () => {
		navigate(`/admin/plays/${playId}/review`, {
			state: { playId: playId, showStatus: playDetailData?.result?.showStatus },
		});
	};

	if (playLoading) return <div>로딩 중...</div>;
	if (playError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

	return (
		<Container>
			<SectionTitle>소극장 공연 관리</SectionTitle>
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
					{Object.entries(filterLabelMap).map(([key, label]) => (
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

			<Content>
				<Table>
					<Title onClick={goBack}>
						{'<'} {editValues.showName}
					</Title>
					<tbody>
						{filteredRows.map((row, index) => (
							<tr key={index}>
								<th>{row.label}</th>
								<td>
									{isEditing && editableKeys.includes(row.key) ? (
										row.key === 'summary' ? (
											<TextArea
												value={editValues[row.key] ?? ''}
												onChange={(e) =>
													handleInputChange(row.key, e.target.value)
												}
											/>
										) : (
											<Input
												type="text"
												value={editValues[row.key] ?? ''}
												onChange={(e) =>
													handleInputChange(row.key, e.target.value)
												}
											/>
										)
									) : (
										row.value
									)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<div className="buttons">
					{isEditing ? (
						<Button onClick={handleSave}>수정완료</Button>
					) : (
						<>
							<Button onClick={() => setIsEditing(true)}>수정하기</Button>
							<WButton onClick={goReview}>최종 등록/반려하기</WButton>
						</>
					)}
				</div>
			</Content>
		</Container>
	);
}

export default PlaysDetail;

const Container = styled.div`
	width: 100vw;
	display: flex;
    flex-direction: column;
    padding: 50px; 120px; 100px 50px;
`;
const Content = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;

	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 20px;
	}
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
		max-height: 138px;
		overflow-y: auto;
		display: block;

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
	background: ${({ theme }) => theme.colors.pink100};
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink600};
`;

const WButton = styled.button`
	align-self: flex-end;
	width: 156px;
	height: 38px;
	border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.pink600};

	background: ${({ theme }) => theme.colors.grayWhite};
    font-size: font-size: ${({ theme }) => theme.font.fontSize.title16};
    font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink600};
`;
const PButton = styled.button`
	align-self: flex-end;
	width: 156px;
	height: 38px;
	border-radius: 8px;

	background: ${({ theme }) => theme.colors.pink600};
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayWhite};
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
const Input = styled.input`
	width: 100%;
	padding: 6px 8px;
	font-size: 16px;
	font-family: inherit;
	border: 1px solid #ccc;
	border-radius: 4px;
`;

const TextArea = styled.textarea`
	width: 100%;
	min-height: 100px;
	padding: 6px 8px;
	font-size: 16px;
	font-family: inherit;
	border: 1px solid #ccc;
	border-radius: 4px;
	resize: vertical;
`;
