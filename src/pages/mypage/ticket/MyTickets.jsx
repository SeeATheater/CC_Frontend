import styled from 'styled-components';
import { useState } from 'react';
import TicketContainer from '@/components/TicketContainer';
import TopBar from '@/components/TopBar';
import { useNavigate } from 'react-router-dom';
import TopBarWeb from '@/components/TopBarWeb';
import PillToggleGroup from '@/components/PillToggleGroup';
import useCustomFetch from '@/utils/hooks/useCustomFetch.js';
function MyTickets() {
	const role = sessionStorage.getItem('selectedRole');
console.log('롤', role);
	const [selected, setSelected] = useState('전체');
	const navigate = useNavigate();

	function onPrev() {
		navigate(-1);
	}
	const ticketHeaders = ['예매일', '장소', '관람일시', '상태', '취소일시'];

	// const details = [
	// 	{
	// 		name: '실종',
	// 		count: 2,
	// 		imgSrc: Poster,
	// 		bookingDate: '2025-01-15',
	// 		place: '홍익대학교 학생회관 3층 소극장',
	// 		performanceDate: '2025-03-21 (금) 14:30 1회',
	// 		cancelDeadline: '2025-03-20 (목) 17:00 까지',
	// 		status: '예매 진행중',
	// 		navLink: '1',
	// 	},
	// 	{
	// 		name: '실종',
	// 		count: 2,
	// 		imgSrc: Poster,
	// 		bookingDate: '2025-01-15',
	// 		place: '홍익대학교 학생회관 3층 소극장',
	// 		performanceDate: '2025-03-21 (금) 14:30 1회',
	// 		cancelDeadline: '2025-03-20 (목) 17:00 까지',
	// 		status: '공연 종료',
	// 		navLink: '1',
	// 	},
	// ];

	// const page = 0;
	// const size = 5;
	const {
		data: dataAllTicket,
		loading: loadingAllTicket,
		error: errorAllTicket,
	} = useCustomFetch(`myTickets/list?status=ALL&page=0&size=20`);
	console.log('전체티켓', dataAllTicket);
	// 유저
	const {
		data: dataReservedTicket,
		loading: loadingReservedTicket,
		error: errorReservedTicket,
	} = useCustomFetch(`myTickets/list?status=RESERVED&page=0&size=20`);
	console.log('예약티켓', dataReservedTicket);
	const {
		data: dataCancelledTicket,
		loading: loadingCancelledTicket,
		error: errorCancelledTicket,
	} = useCustomFetch(`myTickets/list?status=CANCELLED&page=0&size=20`);
	console.log('취소티켓', dataCancelledTicket);
	return (
		<MyTicketsWrapper>
			<div className="only-mobile">
				<TopBar onPrev={onPrev}>
					{role === 'PERFORMER' ? '등록한 공연' : '내 티켓'}
				</TopBar>
			</div>
			{role && (
  <div className="only-web-flex">
    <TopBarWeb>
      {role === 'PERFORMER' ? '등록한 공연' : '내 티켓'}
    </TopBarWeb>
  </div>
)}

			<Wrapper>
				{role === 'PERFORMER' ? (
					<PillToggleGroup
						options={['전체', '예매 진행', '공연 종료']}
						onSelect={(option) => setSelected(option)}
					/>
				) : (
					<PillToggleGroup
						options={['전체', '예매 완료', '예매 취소']}
						onSelect={(option) => setSelected(option)}
					/>
				)}

				<div style={{ marginBottom: '28px' }} />
				{selected === '전체' && (
					<>
						{loadingAllTicket ? (
							<p>로딩 중...</p>
						) : errorAllTicket ? (
							<p>데이터를 불러오지 못했습니다.</p>
						) : dataAllTicket?.result?.content?.length > 0 ? (
							dataAllTicket.result.content?.map((detail, idx) => (
								<TicketContainer
									key={idx}
									details={detail}
									header={ticketHeaders}
								/>
							))
						) : (
							<p>내역이 없습니다</p>
						)}
					</>
				)}

				{selected === '예매 완료' && (
					<>
						{loadingReservedTicket ? (
							<p>로딩 중...</p>
						) : errorReservedTicket ? (
							<p>데이터를 불러오지 못했습니다.</p>
						) : dataReservedTicket?.result?.content?.length > 0 ? (
							dataReservedTicket.result.content?.map((detail, idx) => (
								<TicketContainer
									key={idx}
									details={detail}
									header={ticketHeaders}
								/>
							))
						) : (
							<p>내역이 없습니다</p>
						)}
					</>
				)}

				{selected === '예매 취소' && (
					<>
						{loadingCancelledTicket ? (
							<p>로딩 중...</p>
						) : errorCancelledTicket ? (
							<p>데이터를 불러오지 못했습니다.</p>
						) : dataCancelledTicket?.result?.content?.length > 0 ? (
							dataCancelledTicket?.result?.content?.map((detail, idx) => (
								<TicketContainer
									key={idx}
									details={detail}
									header={ticketHeaders}
								/>
							))
						) : (
							<p>내역이 없습니다</p>
						)}
					</>
				)}

				{selected === '예매 진행' && (
					<>
						{loadingOngoingTicket ? (
							<p>로딩 중...</p>
						) : errorOngoingTicket ? (
							<p>데이터를 불러오지 못했습니다.</p>
						) : dataOngoingTicket?.content?.length > 0 ? (
							dataOngoingTicket.content.map((detail, idx) => (
								<TicketContainer
									key={idx}
									details={detail}
									header={ticketHeaders}
									isPerformer={true}
								/>
							))
						) : (
							<p>내역이 없습니다</p>
						)}
					</>
				)}

				{selected === '공연 종료' && (
					<>
						{loadingEndedTicket ? (
							<p>로딩 중...</p>
						) : errorEndedTicket ? (
							<p>데이터를 불러오지 못했습니다.</p>
						) : dataEndedTicket?.content?.length > 0 ? (
							dataEndedTicket.content.map((detail, idx) => (
								<TicketContainer
									key={idx}
									details={detail}
									header={ticketHeaders}
									isPerformer={true}
								/>
							))
						) : (
							<p>내역이 없습니다</p>
						)}
					</>
				)}
			</Wrapper>
		</MyTicketsWrapper>
	);
}
export default MyTickets;

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (min-width: 768px) {
		flex: 0.8;
		padding-left: 110px;
	}
	@media (max-width: 768px) {
		padding: 20px;
	}
`;

const MyTicketsWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (min-width: 768px) {
		padding: 100px 70px;
	}
`;
