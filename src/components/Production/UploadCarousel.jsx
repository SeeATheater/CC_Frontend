import { useState } from 'react';
import styled from 'styled-components';

import ImageUploadBox from '@/components/ImageUploadBox2';

function UploadCarousel({ CarouselData, onAddImage, onRemoveImage }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	return (
		<Container>
			<ImageArea>
				{CarouselData[currentIndex].type === 'image' ? (
					<>
						<img src={CarouselData[currentIndex].previewUrl} />
						<DeleteBtn
							onClick={() => onRemoveImage(CarouselData[currentIndex].index)}
						>
							✕
						</DeleteBtn>
					</>
				) : (
					<ImageUploadBox
						size="100%"
						aspect-ratio="1"
						onFileSelect={onAddImage}
					/>
				)}
			</ImageArea>

			<DotWrapper>
				{CarouselData.map((_, index) => (
					<Dot
						key={index}
						$isActive={index === currentIndex}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</DotWrapper>
		</Container>
	);
}

export default UploadCarousel;

const Container = styled.div`
	width: 100%;
	aspect-ratio: 1 / 1;
	position: relative;
`;

const ImageArea = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 12px;
	overflow: hidden;
	position: relative;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const DotWrapper = styled.div`
	position: absolute;
	bottom: 12px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	gap: 6px;
`;

const Dot = styled.div`
	width: 4px;
	height: 4px;
	border-radius: 50%;
	cursor: pointer;
	background-color: ${({ $isActive, theme }) =>
		$isActive ? theme.colors.pink500 : theme.colors.gray300};
`;
const DeleteBtn = styled.button`
	position: absolute;
	top: 8px;
	right: 8px;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	border: none;
	background: rgba(0, 0, 0, 0.6);
	color: white;
	cursor: pointer;
`;
