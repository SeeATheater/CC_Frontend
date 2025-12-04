import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import SimpleTable from '@/components/Admin/SimpleTable';
import Search from '@/assets/icons/searchBlack.svg?react';

function InquiryDetail() {
	const { inquiryId } = useParams();
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};

	const {
		data: inquiryData,
		error: inquiryError,
		loading: inquiryLoading,
	} = useCustomFetch(`/admin/inquiry/${inquiryId}`);
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
		name: '이름',
		number: '전화번호',
		email: 'E-mail',
		date: '문의작성일',
		situation: '진행도',
		id: 0,
	};
	const apiRows = useMemo(() => {
		if (!inquiryData || !inquiryData.result) return [];
		return [inquiryData?.result].map((item) => ({
			name: item.memberName,
			number: item.memberPhoneNumber,
			email: item.memberEmail,
			date: formatDate(item.createdAt),
			situation: item.inquiryStatus,
			id: 1,
		}));
	}, [inquiryData]);

	const addedData = [headerRow, ...apiRows];

	return (
		<Container>
			<SectionTitle>문의</SectionTitle>
			<FilterArea>
				<SearchInput>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search width={15} />
				</SearchInput>
			</FilterArea>

			<Title onClick={goBack}>{'<'} 일대일 문의</Title>
			<ContentArea>
				<SimpleTable data={addedData} />
				<div>
					<p className="boxtitle">문의 내용</p>
					<Box>
						<p className="inquiryTitle">제목: {inquiryData?.result.title}</p>
						<p>{inquiryData?.result.content}</p>
					</Box>
				</div>

				<div>
					<p>답변</p>
					<Box>
						<p>{inquiryData?.result.reply}</p>
					</Box>
				</div>
			</ContentArea>
		</Container>
	);
}

export default InquiryDetail;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 50px; 120px; 100px 50px;
`;
const ContentArea = styled.div`
	width: 100%;
	display: flex;
	gap: 26px;
	justify-content: center;
	flex-direction: column;

	.boxtitle {
		color: #424242;
		font-family: Pretendard;
		font-size: 16px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		margin-bottom: 5px;
	}
`;
const Title = styled.h2`
	color: #000;
	text-align: left;
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	margin-bottom: 16px;
`;
const Box = styled.div`
	width: 100%;
	min-height: 198px;

	padding: 10px 14px;

	display: flex;
	gap: 10px;
	flex-direction: column;
	align-items: flex-start;

	border: 1px solid #8f8e94;

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};

	.inquiryTitle {
		color: #8f8e94;
		font-family: Pretendard;
		font-size: 16px;
	}
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
