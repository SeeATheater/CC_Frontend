import styled from 'styled-components';

import Movie from '@/assets/icons/Movie.svg?react';
import Board from '@/assets/icons/board.svg?react';
import Photo from '@/assets/icons/Photo.svg?react';
import Profile from '@/assets/icons/Profile.svg?react';
import Information from '@/assets/icons/information.svg?react';
import Logo from '@/assets/icons/logo.svg?react';
import Notification from '@/assets/icons/notification.svg?react';

import MovieFilled from '@/assets/icons/movie-filled.svg?react';
import BoardFilled from '@/assets/icons/board-filled.svg?react';
import PhotoFilled from '@/assets/icons/photo-filled.svg?react';
import ProfileFilled from '@/assets/icons/profile-filled.svg?react';
import NotificationFilled from '@/assets/icons/notification-filled.svg?react';

import NotiWebModal from '@/components/Notification/NotiWebModal';

import { useAuth } from '@/context/AuthContext';

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function HomeIconMenu({ isWeb, selectedMenu }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { isLoggedIn } = useAuth();

	const isAboutCC = location.pathname === '/mypage/about-cc';

	const [isNotiModalOpen, setIsNotiModalOpen] = useState(false);

	const modalRef = useRef(null);

	const handleDocumentClick = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			setIsNotiModalOpen(false);
		}
	};

	useEffect(() => {
		if (isNotiModalOpen) {
			document.addEventListener('mousedown', handleDocumentClick);
		} else {
			document.removeEventListener('mousedown', handleDocumentClick);
		}
		return () => {
			document.removeEventListener('mousedown', handleDocumentClick);
		};
	}, [isNotiModalOpen]);

	return (
		<>
			<Wrapper $isWeb={isWeb} $bgBlack={isAboutCC}>
				<MenuWrapper $isWeb={isWeb}>
					<div className="logo" onClick={() => navigate('/home')}>
						<Logo />
					</div>
					<div onClick={() => navigate('/plays')}>
						{selectedMenu === 'plays' ? <MovieFilled /> : <Movie />}
						<span>소극장 공연</span>
					</div>
					<div onClick={() => navigate('/board')}>
						{selectedMenu === 'board' ? <BoardFilled /> : <Board />}
						<span>게시판</span>
					</div>
					<div onClick={() => navigate('/gallery')}>
						{selectedMenu === 'gallery' ? <PhotoFilled /> : <Photo />}
						<span>사진첩</span>
					</div>

					<div
						className="only-web"
						onClick={() => {
							if (!isLoggedIn) {
								navigate('/login');
							} else {
								setIsNotiModalOpen((prev) => !prev);
							}
						}}
					>
						{isNotiModalOpen ? <NotificationFilled /> : <Notification />}
						<span>알림</span>
					</div>

					<div onClick={() => navigate('/mypage')}>
						{selectedMenu === 'mypage' ? <ProfileFilled /> : <Profile />}
						<span>프로필</span>
					</div>
					{!isWeb && (
						<div>
							<Information />
							<span>cc</span>
						</div>
					)}
				</MenuWrapper>
			</Wrapper>
			{isNotiModalOpen && (
				<NotiWebModal onClose={() => setIsNotiModalOpen(false)} />
			)}
		</>
	);
}
export default HomeIconMenu;

const Wrapper = styled.div`
	height: 100%;
	padding: ${(props) => (props.$isWeb ? '30px' : '0px 14px')};
	padding-top: ${(props) => (props.$isWeb ? '60px' : '0px')};
	border-right: ${(props) =>
		props.$isWeb
			? props.$bgBlack
				? '1px solid #696969'
				: '1px solid #DDDDDD'
			: 'none'};

	background-color: ${(props) =>
		props.$bgBlack ? 'black' : 'white'}; // 테스트용

	z-index: 1999;
`;
const MenuWrapper = styled.div`
	display: flex;
	height: ${(props) => (props.$isWeb ? '440px' : '')};
	flex-direction: ${(props) => (props.$isWeb ? 'column' : 'row')};
	justify-content: space-between;
	.logo {
		display: ${(props) => (props.$isWeb ? 'flex' : 'none')};
	}
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 52px;
		width: 52px;
		@media (min-width: 768px) {
			width: 40px;
			height: 40px;
		}
		svg {
			width: 24px;
			height: 24px;
			object-fit: contain;
			@media (min-width: 768px) {
				width: 40px;
				height: 40px;
			}
		}

		span {
			color: ${({ theme }) => theme.colors.pink600};
			display: ${(props) => (props.$isWeb ? 'none' : 'block')};
			font-size: ${({ theme }) => theme.font.fontSize.body10};
			font-style: normal;
			font-weight: ${({ theme }) => theme.font.fontWeight.bold};
			line-height: normal;
			letter-spacing: -0.3px;
		}
	}
`;

const ModalWrapper = styled.div`
	position: fixed;
	top: 100px;
	left: 100px;
	z-index: 9999;
`;
