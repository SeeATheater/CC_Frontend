import styled from 'styled-components';

function Masonry(props) {
	return (
		<>
			<ImageArea>
				{props.imageData?.map((data, idx) => (
					<Item key={idx}>
						<img src={data?.src} alt="공연사진" className="pic" />
						<Text>
							<p className="title">{data?.text}</p>
							{data.theatre && <p className="theatre">{data.theatre}</p>}
						</Text>
					</Item>
				))}
			</ImageArea>
		</>
	);
}

export default Masonry;

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
