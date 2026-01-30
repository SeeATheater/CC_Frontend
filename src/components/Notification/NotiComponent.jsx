import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import Noti from '@/components/Notification/Noti';
import PillToggleGroup from '@/components/PillToggleGroup';

function NotiComponent() {
	const options = ['전체', '소극장 공연', '추천 공연'];
	const SIZE = 10;

	const [selectedOption, setSelectedOption] = useState('전체');
	const [notices, setNotices] = useState([]);
	const [cursorId, setCursorId] = useState(null);
	const [cursorCreated, setCursorCreated] = useState(null);
	const [hasNext, setHasNext] = useState(true);
	const [isFetching, setIsFetching] = useState(false);

	const isRequesting = useRef(false);
	const observerRef = useRef(null);
	const { fetchData } = useCustomFetch();

	const fetchNoti = useCallback(async () => {
		if (isRequesting.current || !hasNext) return;

		isRequesting.current = true;
		setIsFetching(true);

		const url =
			cursorId === null
				? `/notice?size=${SIZE}`
				: `/notice?cursorId=${cursorId}&cursorCreatedAt=${cursorCreated}&size=${SIZE}`;

		try {
			const res = await fetchData(url, 'GET');
			const result = res?.data?.result;

			if (result) {
				setNotices((prev) => [...prev, ...(result.memberNotices || [])]);
				setHasNext(result.hasNext);
				setCursorId(result.nextCursorId);
				setCursorCreated(result.nextCursorCreatedAt);
			}
		} catch (error) {
			console.error('알림 로딩 실패:', error);
		} finally {
			isRequesting.current = false;
			setIsFetching(false);
		}
	}, [cursorId, hasNext, isFetching, fetchData]);

	useEffect(() => {
		fetchNoti();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNext && !isFetching) {
					fetchNoti();
				}
			},
			{ rootMargin: '100px', threshold: 0 },
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => observer.disconnect();
	}, [fetchNoti, hasNext, isFetching]);

	const filteredNotices = notices.filter((noti) => {
		if (selectedOption === '전체') return true;
		if (selectedOption === '추천 공연') return noti.noticeType === 'AD';
		if (selectedOption === '소극장 공연') return noti.noticeType !== 'AD';
		return true;
	});

	console.log(notices);

	return (
		<Box>
			<Toggle>
				<PillToggleGroup
					options={options}
					value={selectedOption}
					onSelect={setSelectedOption}
				/>
			</Toggle>

			<NotiList>
				{filteredNotices.map((noti) => (
					<Noti
						key={noti.id}
						id={noti.id}
						type={noti.noticeType}
						content={noti.message}
						contentId={noti.contentId}
						when={noti.createdAt}
						checked={noti.isRead}
					/>
				))}

				<div
					ref={observerRef}
					style={{
						height: '50px',
						marginBottom: '10px',
					}}
				>
					{isFetching && <ExtraMessage>로딩 중...</ExtraMessage>}
				</div>

				{!isFetching && filteredNotices.length === 0 && (
					<ExtraMessage>알림이 없습니다.</ExtraMessage>
				)}
			</NotiList>
		</Box>
	);
}

export default NotiComponent;
const Box = styled.div`
	@media (min-width: 768px) {
		width: 100%;
		//max-height: 1018px;

		background-color: ${({ theme }) => theme.colors.grayWhite};
		border-radius: 0px 5px 5px 5px;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
`;

const Header = styled.div`
	@media (min-width: 768px) {
		padding: 30px 48px 16px 48px;

		display: flex;
		gap: 12px;
		align-items: center;

		h2 {
			font-size: ${({ theme }) => theme.font.fontSize.headline24};
			font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
			color: ${({ theme }) => theme.colors.grayMain};
		}
	}
`;

const Toggle = styled.div`
	padding: 20px 20px;
	display: flex;
	gap: 15px;

	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};

	@media (min-width: 768px) {
		padding: 16px 48px 40px 48px;
		display: flex;
		gap: 12px;
		font-size: ${({ theme }) => theme.font.fontSize.title16};
	}
`;

const NotiList = styled.div`
	display: flex;
	flex-direction: column;

	gap: 2px;

	@media (min-width: 768px) {
		gap: 0px;
	}
`;

const ExtraMessage = styled.p`
	text-align: center;
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.medium};
	color: ${({ theme }) => theme.colors.grayMain};
	margin: 20px 0;
`;
