import { useRef, useState } from 'react';
import styled from 'styled-components';
import Camera from '@/assets/icons/Camera.svg?react';

function ImageUploadBox({
	size,
	webSize,
	round,
	onFileSelect,
	multiple = true,
}) {
	const fileInputRef = useRef(null);
	const [previewUrls, setPreviewUrls] = useState([]);

	const handleClick = () => {
		fileInputRef.current.click();
	};

	const handleChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		onFileSelect(file); // ✅ File 하나만 전달
	};

	return (
		<>
			<Box
				size={size}
				webSize={webSize}
				round={round}
				onClick={handleClick}
				role="button"
			>
				{previewUrls.length > 0 ? (
					previewUrls.map((url, idx) => (
						<Preview key={idx} src={url} alt="uploaded preview" />
					))
				) : (
					<Camera />
				)}
			</Box>

			<input
				type="file"
				accept="image/*"
				multiple={multiple}
				style={{ display: 'none' }}
				ref={fileInputRef}
				onChange={handleChange}
			/>
		</>
	);
}

export default ImageUploadBox;
const Box = styled.div`
	background: ${({ theme }) => theme.colors.gray200};
	width: ${(props) => props.size || '150px'};
	height: ${(props) => props.size || '150px'};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	overflow: hidden;

	border-radius: ${(props) => (props.round ? '50% 50% 10% 50%' : '8px')};

	@media (min-width: 768px) {
		width: ${(props) => props.webSize || props.size || '240px'};
		height: ${(props) => props.webSize || props.size || '240px'};
	}

	img {
		width: 100%;
	}
`;

const Preview = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;
