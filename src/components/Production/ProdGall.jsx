import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function ProdGall({ imageData }) {
	const hasImages = imageData?.result?.content.length > 0;

	const navigate = useNavigate();

	return (
		<>
			{hasImages ? (
				<ImageArea>
					{imageData?.result?.content.map((data, idx) => (
						<Item
							key={idx}
							onClick={() => {
								navigate(`/production/album/${data.photoAlbumId}`);
							}}
						>
							<img
								src={data?.imageResultWithPresignedUrlDTO?.presignedUrl}
								alt="공연사진"
								className="pic"
							/>
							<Text>
								<p className="title">{data?.amateurShowName}</p>
								{data.detailAddress && (
									<p className="theatre">{data?.detailAddress}</p>
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

export default ProdGall;

const EmptyMessage = styled.div`
	text-align: center;
	padding: 50px;
	color: ${({ theme }) => theme.colors.grayMain};
	font-size: ${({ theme }) => theme.font.fontSize.body10};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
	}
`;

const ImageArea = styled.div`
	//고정 너비에서 수정 필요
	column-width: 176px;
	column-gap: 11px;

	@media (min-width: 768px) {
		column-count: 4;
		column-gap: 24px;
	}
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

	@media (min-width: 768px) {
		break-inside: avoid;
		margin-bottom: 32px;
		width: 100%;
		display: inline-block;

		.pic {
			width: 100%;
			border-radius: 5px;
			display: block;
		}
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

	@media (min-width: 768px) {
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
			font-size: ${({ theme }) => theme.font.fontSize.body10};
			color: ${({ theme }) => theme.colors.gray400};
			font-weight: ${({ theme }) => theme.font.fontWeight.regular};
		}
	}
`;
