import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
function BoardPreviewCardWeb({ data }) {
	const navigate = useNavigate();

		if (!Array.isArray(data) || data.length === 0) {
		return null; // or 로딩 UI
	}

	const title = '상상도 못한 게시판..ㄴ(°0°)ㄱ';
	const text =
		'우오앙 여기도 이런 게시판이 있구나 신기 방기 많이 많이 게시판 이용해야겟다~ 글은 가로길이 800px 넘어가면 다음단락으로 내려가도록... 세줄 넘어가면 ...으로 대체 padding 값은 20px 입니당!  옆에 네모칸은 사진 있을경우 저렇게 쓰면 될것 같고 아래 게시판도 마찬가지로 해당됩니다!';
	return (
		<Wrapper>
			{ (
				<div onClick={() => navigate(`/board/post/${data[0].boardId}`)}>
					<h1>{data[0]?.title}</h1>
					<p>{data[0]?.content}</p>
				</div>
			)}
			{data[0].imgUrl &&<img src={data[0]?.imgUrl} />}
		</Wrapper>
	);
}
export default BoardPreviewCardWeb;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	max-width: 1146px;
	height: 140px;
	background: ${({ theme }) => theme.colors.gray200};
	padding: 20px;
	gap: 200px;
	h1 {
		color: ${({ theme }) => theme.colors.grayMain};
		margin-bottom: 16px;
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.48px;
	}
	p {
		max-width: 800px;
		color: ${({ theme }) => theme.colors.gray500};
		font-family: 'NanumSquare Neo OTF';
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: 18px; /* 128.571% */
		letter-spacing: -0.42px;
		display: -webkit-box;
		-webkit-line-clamp: 3; /* 최대 3줄까지 보임 */
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
`;
