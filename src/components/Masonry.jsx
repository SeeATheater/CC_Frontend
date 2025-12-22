import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Masonry({ imageData }) {
	const hasImages = imageData?.length > 0;
	const navigate = useNavigate();
	const goAlbum = (prodId, photoAlbumId) => {
		if (!photoAlbumId) return;
		navigate(`/production/album/${prodId}/${photoAlbumId}`);
	};

	return (
		<>
			{hasImages ? (
				<ImageArea>
					{imageData?.map((data, idx) => (
						<Item
							key={idx}
							onClick={() => goAlbum(data.memberId, data.photoAlbumId)}
						>
							<img src={data?.imageUrl} alt="공연사진" className="pic" />
							<Text>
								<p className="title">{data?.amateurShowName}</p>
								{data?.place && <p className="theatre">{data.place}</p>}
							</Text>
						</Item>
					))}
				</ImageArea>
			) : (
				<EmptyMessage>사진이 없습니다.</EmptyMessage>
			)}
		</>
	);
}

export default Masonry;

const EmptyMessage = styled.div`
	text-align: center;
	padding: 50px;
	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.body10};
`;

const ImageArea = styled.div`
	//고정 너비에서 수정 필요
	column-width: 176px;
	column-gap: 11px;
`;

const Item = styled.div`
	break-inside: avoid;
	margin-bottom: 8px;
	display: inline-block;
	width: 100%;

	.pic {
		width: 100%;
		height: auto;
		border-radius: 3px;
		object-fit: unset;
		display: block;
	}
`;
const Text = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	margin-top: 8px;

	.title {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
	.theatre {
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		color: ${({ theme }) => theme.colors.gray400};
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
	}
`;
