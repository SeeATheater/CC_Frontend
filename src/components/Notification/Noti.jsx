import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import Board from '@/assets/icons/board-filled.svg?react';
import Logo from '@/assets/icons/logo.svg?react';
import Movie from '@/assets/icons/movie-filled.svg?react';

function Noti({ contentId, type, content, when, checked, onClick }) {
	const navigate = useNavigate();

	//REPLY(댓글 알림), COMMENT(댓글 알림), HOT(게시글 알림),
	//AMATEURSHOW(좋아요 한 극단 공연 등록), TICKET(예매완료), REMIND(공연 당일 리마인드)

	const moveTo = () => {
		let url = null;

		if (type === 'COMMENT' || type === 'REPLY' || type === 'HOT') {
			url = `/board/${contentId}`;
		}

		if (type === 'AMATEURSHOW' || type === 'TICKET' || type === 'REMIND') {
			url = `/plays/detail/${contentId}`;
		}

		if (url) {
			navigate(url);
		}
	};
	
	const renderIcon = () => {
		if (type === 'AMATEURSHOW' || type === 'REMIND' || type === 'TICKET')
			return <Movie width={16} />;
		if (type === 'HOT' || '') return <Board width={16} />;
		if (type === 'COMMENT' || type === 'REPLY') return <Logo width={16} />;
		return null;
	};

	const getCategoryLabel = () => {
		switch (type) {
			case 'REPLY':
			case 'COMMENT':
				return '댓글 알림';
			case 'HOT':
				return '게시글 알림';
			case 'AMATEURSHOW':
				return '좋아요 한 극단 공연 등록';
			case 'TICKET':
				return '예매 완료';
			case 'REMIND':
				return '공연 당일 리마인드';
			default:
				return '알림';
		}
	};

	function formatWhen(createdAt) {
		const now = new Date();
		const created = new Date(createdAt);
		const diffMs = now - created;

		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		if (diffHours < 24) {
			return `${diffHours}시간 전`;
		} else {
			return `${created.getMonth() + 1}월 ${created.getDate()}일`;
		}
	}

	return (
		<Container checked={checked} onClick={(onClick, moveTo)}>
			<div className="smallTitle">
				{renderIcon()}
				<p className="category">{getCategoryLabel()}</p>
			</div>
			<p className="notiContent">{content}</p>
			<p className="when">{formatWhen(when)}</p>
		</Container>
	);
}

export default Noti;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px 20px;

	background-color: ${({ checked, theme }) =>
		checked ? theme.colors.grayWhite : theme.colors.pink100};

	.smallTitle {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 16px;
	}
	.category {
		font-size: ${({ theme }) => theme.font.fontSize.body12};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.gray400};
	}
	.notiContent {
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.grayMain};
	}
	.when {
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.gray400};
	}

	@media (min-width: 768px) {
		padding: 28px 48px;

		.category {
			font-size: ${({ theme }) => theme.font.fontSize.body14};
			font-weight: ${({ theme }) => theme.font.fontWeight.normal};
			color: ${({ theme }) => theme.colors.gray400};
		}
		.notiContent {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
			font-weight: ${({ theme }) => theme.font.fontWeight.bold};
			color: ${({ theme }) => theme.colors.grayMain};
		}
		.when {
			font-size: ${({ theme }) => theme.font.fontSize.body13};
			font-weight: ${({ theme }) => theme.font.fontWeight.normal};
			color: ${({ theme }) => theme.colors.gray400};
		}
	}
`;
