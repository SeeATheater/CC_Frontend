import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import styled from 'styled-components';
import Poster from '@/assets/images/test-poster2.png';

import TopBarWeb from '@/components/TopBarWeb';
import { Await } from 'react-router-dom';
import { useState } from 'react';
import useCustomFetch from '@/utils/hooks/useCustomFetch.js';
import { useParams } from 'react-router-dom';
// const ticketHeaders = ['예매일', '장소', '관람일시', '상태', '취소가능일시'];
/*
const details = {
	title: '실종',
	imgSrc: Poster,
	count: 2,
	bookingDate: '2025-01-15',
	place: '홍익대학교 학생회관 3층 소극장',
	performanceDate: '2025-03-21 (금) 14:30 1회',
	status: '예매 진행중',
	cancelDeadline: {
		deadline: '2025-03-20 (목) 17:00 까지',
		extra: [
			{ date: '2025.01.15 ~ 2025.01.22', fee: '없음' },
			{ date: '2025.01.22 ~ 2025.03.11', fee: '장당 5000원' },
			{ date: '2025.03.12 ~ 2025.03.14', fee: '티켓금액의 10%' },
			{ date: '2025.03.15 ~ 2025.03.18', fee: '티켓금액의 20%' },
			{ date: '2025.03.19 ~ 2025.03.20', fee: '티켓 금액의 30%' },
		],
	},
};
*/
function TicketDetail() {
	const navigate = useNavigate();
	const { ticketId } = useParams();

	const { data, loading, error, fetchData } = useCustomFetch(
		`/myTickets/${ticketId}/getMyTicket`,
	);

	console.log('ticket detail', data);
	// 모달창 관련 함수
	// const [showAlert, setShowAlert] = useState(false);

	const [isChecked, setIsChecked] = useState(false);
	const handleCancelClick = async () => {
		if (!isChecked) {
			alert('취소 수수료 동의에 체크해주세요.');
			return;
		}

		const response = await fetchData(`/myTickets/${ticketId}/cancel`, 'PATCH');

		if (response?.status === 200) {
			alert('티켓이 성공적으로 취소되었습니다.');
		} else {
			alert('티켓 취소에 실패했습니다.');
		}
	};

	function onPrev() {
		navigate(-1);
	}
	if (loading) return <div>로딩중...</div>;
	if (error) return <div>에러 발생: {error.message}</div>;
	if (!data?.result) return <div>데이터가 없습니다.</div>;

	let showTitle,
		quantity,
		posterImageUrl,
		reserveDateTime,
		performanceDateTime,
		cancelAvailableUntil,
		detailAddress,
		reservationStatus;
	if (data?.result) {
		({
			showTitle,
			quantity,
			posterImageUrl,
			reserveDateTime,
			performanceDateTime,
			cancelAvailableUntil,
			detailAddress,
			reservationStatus,
		} = data.result);
	}
	const basicUrl = import.meta.env.VITE_REACT_APP_BASIC_URL;

	// const detail = data?.result;
	// const header = ticketHeaders;

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

	const statusLabel = {
		CANCELLED: '예매 취소',
		RESERVED: '예매 완료',
	};
	return (
		<>
			<MyTicketsWrapper>
				{/*모바일 상단바*/}
				<div className="only-mobile">
					<TopBar onPrev={onPrev}>티켓 예매 내역</TopBar>
				</div>
				{/*웹 상단바 */}
				<div className="only-web-flex">
					<TopBarWeb>티켓 예매 내역</TopBarWeb>
				</div>
				{/*본문*/}
				<Wrapper>
					{/* 모바일 포스터 */}
					<div
						className="only-mobile"
						style={{ display: 'flex', justifyContent: 'center' }}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							{posterImageUrl ? (
								<img src={posterImageUrl} />
							) : (
								<div style={{ width: '157px', height: '220px' }}></div>
							)}

							<h1>
								{showTitle ?? 'null'} {quantity ?? 'null'}매
							</h1>
							<p className="color-pink">{statusLabel[reservationStatus]}</p>
						</div>
					</div>
					{/*웹 포스터*/}
					<WebPoster className="only-web">
						<img src={posterImageUrl} />
					</WebPoster>
					{/*티켓 정보 */}
					<DetailWrapper>
						<Table>
							<tbody>
								<tr>
									<th>예매일</th>
									<td>{reserveDateTime?.split('T')[0] ?? 'null'}</td>
								</tr>
								<tr>
									<th>장소</th>
									<td>{detailAddress ?? 'null'}</td>
								</tr>
								<tr>
									<th>관람일시</th>
									<td>{formatDateTime(performanceDateTime) ?? 'null'}</td>
								</tr>
								<tr>
									<th>상태</th>
									<td>{statusLabel[reservationStatus] ?? 'null'}</td>
								</tr>
								<tr>
									<th>취소가능일시</th>
									<td>
										{cancelAvailableUntil ?? 'null'}
										{/*
											{cancelDeadline.deadline}
										{cancelDeadline?.extra?.map((e) => (
											<div style={{ display: 'flex' }}>
												<span>{e.date}</span>
												<span className="color-pink">{e.fee}</span>
											</div>
										))}
										*/}
									</td>
								</tr>
							</tbody>
						</Table>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								marginBottom: '34px',
							}}
						>
							<h3>참고 사항</h3>
							<span>
								예매 수수료는 예매일 이후 취소 시에는 환불되지 않습니다.
							</span>
							<span>
								단, 예매 당일 밤 12시 이전 취소 시에는 취소 수수료가 없음 (취소
								기한내에 한함)
							</span>
							<span>
								취소수수료는 취소시점에 따라 달라지며, 취소 진행 시 확인 하실 수
								있습니다.
							</span>
						</div>
						{reservationStatus === 'CANCELLED' ? (
							<></>
						) : (
							<div
								className="checkbox"
								style={{
									marginBottom: '60px',
								}}
							>
								<label
									style={{
										textAlign: 'center',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									취소 수수료를 확인하였으며, 이에 동의합니다
									<input
										type="checkbox"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
								</label>
							</div>
						)}

						{reservationStatus === 'CANCELLED' ? (
							<button
								className="btn-light"
								onClick={handleCancelClick}
								disabled={true}
							>
								취소 완료된 티켓입니다
							</button>
						) : (
							<button className="btn-light" onClick={handleCancelClick}>
								예매 취소
							</button>
						)}
					</DetailWrapper>
				</Wrapper>
			</MyTicketsWrapper>
		</>
	);
}
export default TicketDetail;
const Wrapper = styled.div`
	padding: 20px;
	width: 100%;
	display: flex;
	flex-direction: column;

	@media (min-width: 768px) {
		flex-direction: row;
		gap: clamp(40px, 15vw, 150px);
		padding: 30px 110px;
	}

	h1 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.48px;
		margin-bottom: 16px;
	}

	h3 {
		color: ${({ theme }) => theme.colors.gray400};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.42px;
	}

	p {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.42px;
		color: ${({ theme }) => theme.colors.grayMain};
	}

	span {
		color: ${({ theme }) => theme.colors.gray400};
		font-family: 'NanumSquare Neo OTF';
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.3px;
		display: block;
	}

	img {
		@media (max-width: 768px) {
			max-width: 157px;
			max-height: 220px;
			background: gainsboro;
			margin-bottom: 20px;
		}
	}
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	display: flex;
	gap: 8px;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.42px;
	margin-top: 27px;

	th {
		width: 104px;
		text-align: left;
		vertical-align: top;
		color: ${({ theme }) => theme.colors.gray400};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		padding: 10px 0px;
	}

	td {
		color: ${({ theme }) => theme.colors.grayMain};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		padding: 10px 0px;
		display: flex;
		flex-direction: column;
		gap: 12px;

		span {
			display: block;
			&:nth-child(1) {
				width: 145px;
			}
		}
	}
`;

const Title = styled.h1`
	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-style: normal;
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	line-height: normal;
	letter-spacing: -0.48px;
	margin-bottom: 16px;
`;

const MyTicketsWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;

	@media (min-width: 768px) {
		padding: 100px 70px;
	}
`;

const DetailWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;

	@media (min-width: 768px) {
		max-width: 430px;
		min-width: 360px;
	}
`;
const WebPoster = styled.div`
	display: flex;
	flex: 1;
	width: 300px;
	height: 390px;
	position: relative;

	> img {
		width: 100%;
		min-width: 157px;

		height: auto;
		object-fit: cover;
	}
`;
