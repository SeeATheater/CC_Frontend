import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function MasonryWeb({ imageData }) {
	const hasImages = imageData?.length > 0;
	const navigate = useNavigate();
	const goAlbum = (prodId, photoAlbumId) => {
		if (!photoAlbumId) return;
		navigate(`/production/album/${prodId}/${photoAlbumId}`);
	};

	console.log(
		'중복 체크:',
		imageData.map((d) => d.photoAlbumId),
	);

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
								{data?.performerName && (
									<p className="theatre">{data.performerName}</p>
								)}
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

export default MasonryWeb;

const EmptyMessage = styled.div`
	text-align: center;
	padding: 50px;
	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.body10};
`;

const ImageArea = styled.div`
	column-count: 4;
	column-gap: 24px;
`;

const Item = styled.div`
	break-inside: avoid;
	margin-bottom: 32px;
	width: 100%;
	display: inline-block;

	cursor: pointer;

	.pic {
		width: 100%;
		border-radius: 5px;
		display: block;
	}
`;

const Text = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	margin-top: 8px;

	.title {
		font-size: ${({ theme }) => theme.font.fontSize.body16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
	.theatre {
		font-size: ${({ theme }) => theme.font.fontSize.body4};
		color: ${({ theme }) => theme.colors.gray400};
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
	}
`;
