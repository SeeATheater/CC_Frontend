import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import styled from 'styled-components';
import Poster from '@/assets/images/test-poster2.png';
import TopBarWeb from '@/components/TopBarWeb';
import Select from 'react-select';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';
import useCustomFetch from '@/utils/hooks/useCustomFetch.js';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
function RegisteredDetail() {
	const navigate = useNavigate();
	const { showId } = useParams();

	function onPrev() {
		navigate(-1);
	}
	
// 1️⃣ roundId 상태 (최초엔 null)
const [currentRoundId, setCurrentRoundId] = useState(null);

// 2️⃣ API 호출 (roundId 의존)
const { data, loading, error } = useCustomFetch(
  currentRoundId
    ? `performer-page/${showId}?roundId=${currentRoundId}`
    : `performer-page/${showId}`
);

// 3️⃣ API 결과 구조분해
const {
  detailAddress,
  posterImageUrl,
  reservations,
  roundSummaries,
  schedule,
  selectedRoundId,
  showTitle,
} = data?.result || {};

useEffect(() => {
  if (!currentRoundId && selectedRoundId) {
    setCurrentRoundId(selectedRoundId);
  }
}, [selectedRoundId]);

const roundOptions = useMemo(
  () =>
    roundSummaries?.map((round) => ({
      value: round.roundId,
      label: `${round.roundNumber}회차 | ${round.performanceDateTime
        .slice(0, 10)
        .replaceAll('-', '.')}`,
    })) ?? [],
  [roundSummaries]
);

const selectedOption = roundOptions.find(
  (opt) => opt.value === currentRoundId
);

	return (
		<>
			<MyTicketsWrapper>
				{/*모바일 상단바*/}
				<div className="only-mobile">
					<TopBar onPrev={onPrev}>등록한 공연</TopBar>
					
				</div>
				{/*웹 상단바 */}
				<div className="only-web-flex">
					<TopBarWeb>등록한 공연</TopBarWeb>
				</div>
				{/*본문*/}
				<Wrapper>
					{/*웹 포스터*/}
					<div className="only-web nofocus">
						<img src={posterImageUrl}/>
					</div>
					{/*웹 포스터*/}
					<div className="only-mobile-flex nofocus" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
						<img src={posterImageUrl}/>
					</div>
					{/*티켓 정보 */}
					<DetailWrapper>
						
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: '4px',
								marginBottom: '32px',
							}}
						>
							<div className='only-web-flex' style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'10px'}}>
								<h1 onClick={()=>navigate(`/plays/detail/${showId}`)}>{showTitle?? 'null'}</h1>
								<ChevronRightGray />
							</div>	
							<div className='only-mobile-flex' style={{display:'flex', flex:'1', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:'10px'}}>
								<h1 onClick={()=>navigate(`/plays/detail/${showId}`)}>{showTitle?? 'null'}</h1>
								<ChevronRightGray />
							</div>
							
						</div>
						<p style={{ marginBottom: '10px' }}>
							{detailAddress ?? 'null'}
						</p>
						<p className="color-gray400" style={{ marginBottom: '16px' }}>
							{schedule ?? 'null'}
						</p>
						<Hr />
						<Table>
							<tbody>
								<tr>
									<th>날짜</th>
									<th>인원누적</th>
									<th>누적수익</th>
								</tr>
								{roundSummaries?.map((d) => (
								<tr>
									<td>{d.roundNumber}회차ㅣ{d.performanceDateTime.slice(0, 10).replaceAll('-', '.')}
</td>
									<td>{d.sumQuantity}</td>
									<td>{d.sumAmount.toLocaleString()}</td>
								</tr>
								))}
								
								
							</tbody>
						</Table>
					
					<Select
					options={roundOptions}
					value={selectedOption}
					placeholder="회차 선택"
					onChange={(option) => setCurrentRoundId(option.value)}
					/>

						<Table>
							<tbody>
								<tr>
									<th>예매자</th>
									<th>인원수</th>
									<th>결제상태</th>
								</tr>
								{reservations?.map((r) => (
		<tr>
									<td>{r.reserverName ?? 'null'}</td>
									<td>{r.quantity ?? 'null'}</td>
									<td>{r.reservationStatus ?? 'null'}</td>
								</tr>
								))}
						
								
							</tbody>
						</Table>
					</DetailWrapper>
				</Wrapper>
			</MyTicketsWrapper>
		</>
	);
}
export default RegisteredDetail;
const ChevronRightGray = styled(ChevronRight)`
	fill: ${({ theme }) => theme.colors.gray400};
	height: 14px;
`;
const Wrapper = styled.div`
	padding: 20px;
	width: 100%;
	display: flex;
	flex-direction: column;

	@media (min-width: 768px) {
		flex-direction: row;
		gap: clamp(40px, 15vw, 100px);
		padding: 30px 110px;
	}
	

	h1 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.72px;
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
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.48px;
	}

	span {
		color: ${({ theme }) => theme.colors.gray400};
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.3px;
		display: block;
		font-family: 'NanumSquare Neo OTF';
	}

	img {
		max-width: 157px;
		max-height: 220px;
		background: gainsboro;
		margin-bottom: 20px;

		@media (min-width: 768px) {
			max-width: 500px;
			max-height: 700px;
			flex-shrink: 0;
			border-radius: 5px;
		}
	}

	.nofocus  {
  outline: none;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}
`;

const Table = styled.table`
	margin: 32px 0px;

	th {
		width: 580px;
		padding: 8px;
		align-items: center;
		gap: 147px;
		border-radius: 3px;
		background: ${({ theme }) => theme.colors.gray200};
		color: ${({ theme }) => theme.colors.gray500};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.42px;
	}

	td {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		text-align: center;
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.48px;
		padding: 12px;
		border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
		background: ${({ theme }) => theme.colors.grayWhite};

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
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const DetailWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;

	@media (min-width: 768px) {
		max-width: 580px;
		min-width: 480px;
	}
`;

const Hr = styled.div`
	border: none;
	min-height: 1px;
	background-color: ${({ theme }) => theme.colors.gray500};
`;
