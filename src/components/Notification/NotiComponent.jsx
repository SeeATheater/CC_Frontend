import styled from 'styled-components';
import Noti from '@/components/Notification/Noti';
import PillToggleGroup from '@/components/PillToggleGroup';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

function NotiComponent() {
	const options = ['전체', '소극장 공연', '추천 공연'];

	const { data: notiData, error, loading } = useCustomFetch(`/notice`);

	console.log('error:', error);
	console.log('loading:', loading);
	console.log('data:', notiData);

	const { fetchData: markAsRead } = useCustomFetch(null, 'PATCH');

	const handleClick = async (noticeId) => {
		try {
			await markAsRead(`/notice/${noticeId}`);
			location.reload(); //새로고침으로 변경사항 반영
		} catch (error) {
			console.error('알림 읽음 처리 실패', error);
		}
	};

	return (
		<Box>
			<Toggle>
				<PillToggleGroup options={options} />
			</Toggle>

			<NotiList>
				{notiData?.result.items.map((noti) => (
					<Noti
						key={noti.id}
						type={noti.noticeType}
						noticeType={noti.noticeType}
						content={noti.message}
						contentId={noti.contentId}
						when={noti.createdAt}
						checked={noti.isRead}
						onClick={() => handleClick(noti.id)}
					/>
				))}
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

    @media (min-width: 768px) 
        gap: 0px;
	}	
`;
