import styled from 'styled-components';

import { useState } from 'react';
import ShowContainer from '@/components/ShowContainer';
import TopBar from '@/components/TopBar';
import { useNavigate } from 'react-router-dom';
import Poster from '@/assets/images/test-poster2.png';
import TopBarWeb from '@/components/TopBarWeb';
import PillToggleGroup from '@/components/PillToggleGroup';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
function RegisteredPerformances() {
	console.log('🔥 RegisteredPerformances mounted');
	const [selected, setSelected] = useState('전체');
	const navigate = useNavigate();

	function onPrev() {
		navigate(-1);
	}
	const ticketHeaders = ['예매일', '장소', '관람일시', '상태'];

	const page = 0;
	const size = 5;

	const {
		data: dataAllTicket,
		// loading: loadingAllTicket,
		// error: errorAllTicket,
	} = useCustomFetch(`performer-page/myPage/reserveList?page=${page}&size=${size}`);

	const {
		data: dataOngoingTicket,
		// loading: loadingOngoingTicket,
		// error: errorOngoingTicket,
	} = useCustomFetch(
		`performer-page/myPage/reserveList?page=${page}&size=${size}&status=ONGOING`,
	);

	const {
		data: dataEndedTicket,
		// loading: loadingEndedTicket,
		// error: errorEndedTicket,
	} = useCustomFetch(
		`performer-page/myPage/reserveList?page=${page}&size=${size}&status=ENDED`,
	);

	console.log('AllTicket', dataAllTicket);
	console.log('Ongoing', dataOngoingTicket);
	console.log('End', dataEndedTicket);
	return (
		<MyTicketsWrapper>
			<div className="only-mobile">
				<TopBar onPrev={onPrev}>등록한 공연</TopBar>
			</div>
			<div className="only-web-flex">
				<TopBarWeb>등록한 공연</TopBarWeb>
			</div>
			<Wrapper>
				<PillToggleGroup
					options={['전체', '예매 진행', '공연 종료']}
					onSelect={(option) => setSelected(option)}
				/>
				<div style={{ marginBottom: '28px' }} />
				{selected === '전체' && (
					<>
						{dataAllTicket?.result?.content.map((detail) => (
							<>
								<ShowContainer
									details={detail}
									header={ticketHeaders}
									isPerformer={true}
								/>
							</>
						))}
					</>
				)}

				{selected === '예매 진행' &&
					(dataOngoingTicket?.result?.content &&
					dataOngoingTicket.result?.content.length > 0 ? (
						dataOngoingTicket?.result?.content.map((detail) => (
							<>
								<ShowContainer
									details={detail}
									header={ticketHeaders}
									isPerformer={true}
								/>
							</>
						))
					) : (
						<p>내역이 없습니다</p>
					))}
				{selected === '공연 종료' &&
					(dataEndedTicket?.result?.content && dataEndedTicket?.result?.content.length > 0 ? (
						dataEndedTicket?.result?.content.map((detail) => (
							<>
								<ShowContainer
									details={detail}
									header={ticketHeaders}
									isPerformer={true}
								/>
							</>
						))
					) : (
						<p>내역이 없습니다</p>
					))}
			</Wrapper>
		</MyTicketsWrapper>
	);
}
export default RegisteredPerformances;

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
