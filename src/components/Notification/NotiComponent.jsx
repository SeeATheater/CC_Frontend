import styled from 'styled-components';
import { useState } from 'react';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Noti from '@/components/Notification/Noti';
import PillToggleGroup from '@/components/PillToggleGroup';

function NotiComponent() {
	const options = ['전체', '소극장 공연', '추천 공연'];

	const [selectedOption, setSelectedOption] = useState('전체');

	const { data: notiData, error, loading } = useCustomFetch(`/notice`);

	const filteredNotices = notiData?.result?.items.filter((noti) => {
		if (selectedOption === '전체') return true;
		if (selectedOption === '추천 공연') return noti.noticeType === 'AD';
		if (selectedOption === '소극장 공연') return noti.noticeType !== 'AD';
		return true;
	});
	console.log(filteredNotices);

	if (loading) return <div>로딩 중...</div>;
	if (error) return <div>알림을 불러오지 못했습니다.</div>;

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
				{filteredNotices?.map((noti) => (
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

				{filteredNotices && filteredNotices.length === 0 && (
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
