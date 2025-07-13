import { useState} from 'react';
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import Search from '@/assets/icons/searchBlack.svg?react';
import SearchBg from '@/assets/icons/searchBlackBg.svg?react';

function AdminPlayRegister() {
	const play_data = {
		title: '실종',
		uploader: '홍길동',
		uploaderId: 'HONGID',
		date: '2025-01-09 / 14:50',
		tag: '#극중극 #드라마',
		overview: `1998년 가을, ‘아무 국가기관'의 업무 보조를 하게 된 학생 모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.
                    모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.
                    모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.
                    모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.
                    모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.
                    모두가 동일한 것을 추구하는 사회에서 학생은 적응하지 못한다.`,
		account: '토스 0001-0001-0001-0001',
		contact: '인스타그램 @hongdse_111',
		situation: '확인 전',
	};
	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState([
		'title',
		'uploader',
		'uploaderId',
		'date',
		'tag',
		'overview',
		'account',
		'contact',
		'situation',
	]);
	const labelMap = {
		title: '소극장 공연 이름',
		date: '날짜/시간',
		uploader: '등록자명',
	};

	const [result, setResult] = useState('approved');
	const [denyReason, setDenyReason] = useState('');

	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};

	const handleColumnToggle = (column) => {
		setVisibleColumns((prev) =>
			prev.includes(column)
				? prev.filter((c) => c !== column)
				: [...prev, column],
		);
	};

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
			<Content>
				<Table>
					<Title onClick={goBack}>
						{'<'} {play_data.title}
					</Title>
					<tbody>
						<tr>
							<th>등록자명</th>
							<td>{play_data.uploader}</td>
						</tr>
						<tr>
							<th>아이디</th>
							<td>{play_data.uploaderId}</td>
						</tr>
						<tr>
							<th>심사결과</th>
							<td>
								<label>
									<input
										type="radio"
										name="result"
										value="approved"
										checked={result === 'approved'}
										onChange={(e) => setResult(e.target.value)}
									/>
									승인
								</label>
								<label style={{ marginLeft: '20px' }}>
									<input
										type="radio"
										name="result"
										value="denied"
										checked={result === 'denied'}
										onChange={(e) => setResult(e.target.value)}
									/>
									반려
								</label>
							</td>
						</tr>

						{result === 'denied' && (
							<tr>
								<th>반려 사유</th>
								<td>
									<ReasonTextarea
										placeholder="반려 사유를 입력하세요"
										value={denyReason}
										onChange={(e) => setDenyReason(e.target.value)}
									/>
								</td>
							</tr>
						)}
					</tbody>
				</Table>
				<PButton>적용하기</PButton>
			</Content>
		</Container>
	);
}

export default AdminPlayRegister;

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
const Table = styled.table`
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
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	}

	td {
		text-align: left;
		width: 480px;
		max-height: 138px;
		overflow-y: auto;
		display: block;

		padding: 12px 20px;
		border: 1px solid #ddd;
		border-right: none;

		color: #424242;
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	}

	margin-bottom: 80px;
`;

const PButton = styled.button`
	position: fixed;
	bottom: 150px;
	right: 300px;

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
const ReasonTextarea = styled.textarea`
	width: 100%;
	height: 100px;
	padding: 10px;
	font-size: 14px;
	border: 1px solid #ccc;
	border-radius: 5px;
	resize: none;
`;
