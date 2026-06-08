import styled from 'styled-components';
import { useState } from 'react';
import HeartFull from '@/assets/icons/heart-full.svg?react';
import HeartEmpty from '@/assets/icons/HeartEmpty.svg?react';

import useAxios from '@/utils/hooks/useAxios';
function TheaterCard({ data }) {
	const [liked, setLiked] = useState(true);
	const axiosClient = useAxios();
	const handleClick = async (performerId) => {
		try {
			const response = await axiosClient.delete(
				`/member-like/like/${performerId}`,
			);

			if (response.data.isSuccess) {
				console.log('좋아요 취소 성공:', response.data.message);
				setLiked(false);
			} else {
				console.error('좋아요 취소 실패:', response.data.message);
			}
		} catch (error) {
			console.error('API 호출 에러:', error);
		}
	};
	return (
		<Card>
			<img src={data.imgSrc} />
			<div>
				<p>{data.performerName}</p>
				<button onClick={() => handleClick(data.performerId)}>
					{liked ? <HeartFull /> : <HeartEmpty />}
				</button>
			</div>
		</Card>
	);
}
export default TheaterCard;
const Card = styled.div`
	img {
		width: 172px;
		height: 240px;
		border-radius: 3px;
		object-fit: cover;
	}
	& > div {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 8px;
	}
`;
