import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';

function UploadDone() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const albumId = state?.albumId;
	const prodId = state?.prodId;

	const goToAlbum = () => {
		if (!albumId) {
			alert('앨범 정보를 불러올 수 없습니다.');
			return;
		}
		navigate(`/production/album/${prodId}/${albumId}`);
	};

	return (
		<>
			<Web>
				<Container>
					<h3>사진첩이 게시되었습니다.</h3>
					<Btn onClick={goToAlbum}>내가 작성한 사진첩 보러가기</Btn>
				</Container>
			</Web>
			<Mobile>
				<TopBar>
					<StyledChevron width={7} height={15} />
				</TopBar>

				<h3>사진첩 게시 완료!</h3>
				<BtnPink onClick={goToAlbum}>내가 쓴 사진첩 보러가기</BtnPink>
			</Mobile>
		</>
	);
}

export default UploadDone;

const Web = styled.div`
	display: none;

	@media (min-width: 768px) {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

const Mobile = styled.div`
	@media (min-width: 768px) {
		display: none;
	}
	width: 100vw;
	height: 100vh;

	padding: 20px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	h3 {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.pink600};
		text-align: center;
	}
`;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 40px;

	h3 {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.pink600};
	}
`;
const Btn = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};

	cursor: pointer;
	width: 400px;
	height: 40px;

	border-radius: 3px;
	border: 1px solid ${({ theme }) => theme.colors.gray300};
`;
const StyledChevron = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.pink600};
`;
const TopBar = styled.div`
	height: 120px;
	padding-top: 100px;
	display: flex;
	justify-content: start;
`;
const BtnPink = styled.div`
	cursor: pointer;
	width: 100%;
	height: 60px;

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme }) => theme.colors.pink600};

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayWhite};

	border-radius: 10px;
`;
