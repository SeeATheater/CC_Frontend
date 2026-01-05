import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
function BoardPreviewList({ data }) {
	/*
	const mockData = [
		{
			tag: '일반',
			title: '아이폰 16 찾아요',
			text: '알라딘 공연에서 아이폰 16pro를 두고 온거 같은데 혹시 발견하시면 연락주세요',
		},

	];
	*/
	console.log('게시판 미리보기', data);
const navigate=useNavigate();
	const boardTypeLabel = {
		NORMAL: '일반',
		PROMOTION: '홍보',
	};
	return (
		<Wrapper>
			<List>
				{data &&
					data.map((item) => (
						<Li key={item.boardId} onClick={() => navigate(`/board/post/${item.boardId}`)}>
							<div>{boardTypeLabel[item.boardType] || item.boardType}</div>
							<h3>{item.title}</h3>
							<p>{item.content}</p>
						</Li>
					))}
			</List>
		</Wrapper>
	);
}
export default BoardPreviewList;

const Wrapper = styled.div``;
const List = styled.div`
	& > div {
		border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
	}
	& > div:last-child {
		border-bottom: none;
	}
`;

const Li = styled.div`
	padding: 16px 0px;

	div {
		display: inline-flex;
		padding: 2px 8px;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
		background: ${({ theme }) => theme.colors.pink200};
		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.pink600};
		margin-bottom: 14px;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.body10};
		}
	}
	h3 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		line-height: normal;
		letter-spacing: -0.42px;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
		}
	}
	p {
		color: ${({ theme }) => theme.colors.gray400};
		font-family: 'NanumSquare Neo OTF';
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
		line-height: 18px; /* 138.462% */
		letter-spacing: -0.39px;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.body14};
		}
	}
`;
