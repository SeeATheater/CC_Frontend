import { useState, useEffect } from 'react';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Heart from '@/assets/icons/Heart.svg?react';
import HeartFull from '@/assets/icons/heart-full.svg?react';
import styled from 'styled-components';

function LikedButton({ prodId }) {
	const { fetchData, loading: actionLoading } = useCustomFetch();

	const { data: likeData, loading: initialLoading } = useCustomFetch(
		`/member-like/like/${prodId}`,
	);

	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (likeData?.result !== undefined) {
			setLiked(likeData.result);
		}
	}, [likeData]);

	const handleToggleLike = async () => {
		if (!liked) {
			const res = await fetchData(`/member-like/like/${prodId}`, 'POST');
			if (res?.isSuccess) setLiked(true);
		} else {
			const res = await fetchData(`/member-like/like/${prodId}`, 'DELETE');
			if (res?.isSuccess) setLiked(false);
		}
	};

	return (
		<Button
			onClick={handleToggleLike}
			disabled={initialLoading || actionLoading}
		>
			{liked ? <HeartFull width={24} /> : <Heart width={24} />}
		</Button>
	);
}

export default LikedButton;

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: none;
	border: none;
`;
