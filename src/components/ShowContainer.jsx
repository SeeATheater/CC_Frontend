import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';
function ShowContainer({ header, details, isPerformer }) {
	const navigate = useNavigate();
	const {
		amateurShowId,
		showTitle,
		name,
		posterImageUrl,
		detailAddress,
		schedule,
		quantity,
		reserveDateTime,
		status,
		cancelDeadline,
	} = details;

	const isExpired = status === '공연 종료';

	const statusLabel = {
		CANCELLED: '예매 취소',
		RESERVED: '예매 완료',
	};

	const formatDateTime = (isoString) => {
		const d = new Date(isoString);
		const week = ['일', '월', '화', '수', '목', '금', '토'];

		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
			d.getDate(),
		).padStart(2, '0')} (${week[d.getDay()]}) ${String(d.getHours()).padStart(
			2,
			'0',
		)}:${String(d.getMinutes()).padStart(2, '0')}`;
	};
	return (
		<Wrapper
			id={amateurShowId}
			isExpired={isExpired}
			onClick={() => navigate(`${amateurShowId}`)}
		>
			<div className="only-web">
				<img src={posterImageUrl} style={{ width: '140px', height: '200px' }} />
			</div>
			<div>
				<Title>
					{showTitle || name} {quantity} {isPerformer === false && <>매</>}
				</Title>
				<Table>
					<tbody>
						<tr>
							<th>{header[0]}</th>
							<td>{reserveDateTime?.split('T')[0] ?? 'null'}</td>
						</tr>
						<tr>
							<th>{header[1]}</th>
							<td>{detailAddress ?? 'null'}</td>
						</tr>
						<tr>
							<th>{header[2]}</th>
							<td>
								{schedule ?? 'null'}
							</td>
						</tr>
						{header[4] && (
							<tr className="only-web">
								<th>{header[4]}</th>
								<td>{cancelDeadline ?? 'null'}</td>
							</tr>
						)}

						<tr>
							<th>{header[3]}</th>
							<StatusTD>{status ?? 'null'}</StatusTD>
						</tr>
					</tbody>
				</Table>
			</div>
			<div
				className="only-web-flex"
				style={{
					display: 'flex',
					flex: '1',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<ChevronRightGray />
			</div>
		</Wrapper>
	);
}

export default ShowContainer;

const ChevronRightGray = styled(ChevronRight)`
	color: ${({ theme }) => theme.colors.gray400};
	height: 28px;
	width: auto;
`;

const Wrapper = styled.div`
	margin: 20px 0;
	padding: 10px 22px;
	border: 1px solid ${({ theme }) => theme.colors.grayOutline};
	display: flex;
	flex-direction: row;
	gap: 40px;
	background: ${({ theme, isExpired }) =>
		isExpired ? theme.colors.gray200 : 'none'};

	@media (min-width: 768px) {
		padding: 10px 10px 10px 20px;
	}
`;

const Title = styled.h1`
	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.48px;
	margin-bottom: 16px;

	@media (min-width: 768px) {
		margin-bottom: 30px;
		margin-top: 8px;
	}
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	display: flex;
	gap: 8px;

	th {
		width: 88px;
		min-width: 50px;
		text-align: left;
		color: ${({ theme }) => theme.colors.gray400};
		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		font-style: normal;
		line-height: normal;
		letter-spacing: -0.36px;
		padding: 4px 0px;

		@media (min-width: 768px) {
			padding: 6px 0px;
		}
	}

	td {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		font-style: normal;
		line-height: normal;
		letter-spacing: -0.36px;
		padding: 4px 0px;

		@media (min-width: 768px) {
			padding: 6px 0px;
		}
	}
`;

const StatusTD = styled.td`
	color: ${({ theme }) => theme.colors.redWarning} !important;
	font-weight: ${({ theme }) => theme.font.fontWeight.regular};
`;
