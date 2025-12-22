import React, { useState } from 'react';
import Camera from '@/assets/icons/Camera.svg';
import styled from 'styled-components';
import axios from 'axios';

function ImageUploadBox({
	width,
	height,
	webWidth,
	webHeight,
	round,
	onUploadSuccess,
	filePath,
}) {
	const [imageSrc, setImageSrc] = useState(null);

	const accessToken = localStorage.getItem('accessToken');
	console.log('액세스토큰', accessToken);
	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// 미리보기
		const reader = new FileReader();
		reader.onloadend = () => {
			setImageSrc(reader.result);
		};
		reader.readAsDataURL(file);

		try {
			// presigned URL 요청 (🎉 여기 고침)
			const res = await axios.post(
				`https://api.seeatheater.site/s3/uploadUrls?filePath=${filePath}`,
				[file.type.split('/')[1]],
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			console.log(res.config.url);
			console.log(res.config.method);
			console.log('요청한 url', res.data);

			const { imageUrl, keyName, uploadUrl } = res.data[0];

			console.log('업로드url', uploadUrl);
			console.log('파일타입', file.type);
			await axios.put(uploadUrl, file, {
				headers: {
					'Content-Type': file.type, // image/png
				},
			});

			if (onUploadSuccess) {
				onUploadSuccess({ keyName, imageUrl });
			}
		} catch (err) {
			console.error('이미지 업로드 실패:', err);
		}
	};

	return (
		<Box
			width={width}
			height={height}
			webWidth={webWidth}
			webHeight={webHeight}
			round={round}
		>
			{imageSrc ? (
				<img src={imageSrc} alt="uploaded" />
			) : (
				<>
					<IconWrapper>
						<img src={Camera} alt="camera icon" />
					</IconWrapper>
				</>
			)}
			<input type="file" accept="image/*" onChange={handleImageChange} />
		</Box>
	);
}

export default ImageUploadBox;

const Box = styled.div`
	position: relative;
	background: ${({ theme }) => theme.colors.gray200};
	width: ${(props) => (props.width ? props.width : '150px')};
	height: ${(props) => (props.height ? props.height : '150px')};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	overflow: hidden;
	${(props) => (props.round ? 'border-radius: 50% 50% 10% 50%;' : '')};
	@media (min-width: 768px) {
		width: ${(props) => props.webWidth || props.webWidth || '240px'};
		height: ${(props) => props.webHeight || props.webHeight || '240px'};
		width: ${(props) => props.webWidth || props.webWidth || '240px'};
		height: ${(props) => props.webHeight || props.webHeight || '240px'};
	}

	img {
		width: 20px;
		height: 20px;
		object-fit: cover;
	}

	input[type='file'] {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	img {
		width: 100%;
		height: 100%;
	}
`;

const IconWrapper = styled.div`
	@media (min-width: 768px) {
		width: 40px;
		height: 40px;
	}
`;
