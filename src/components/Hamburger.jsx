import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import HamburgerIcon from '@/assets/icons/hamburger.svg?react';
import Alrert from '@/assets/icons/alrert.svg?react';
import Search from '@/assets/icons/search.svg?react';
import ChevronLeft from '@/assets/icons/chevronLeft.svg?react';
import Logo from '@/assets/icons/logo.svg?react';
import FullScreenMenu from './FullScreenMenu';

/**
 * Props 설명:
 * - hasLogo: 로고 표시 여부
 * - title: 타이틀 텍스트 (중앙 정렬)
 * - back: 뒤로가기 버튼 여부
 * - noIcon: 우측 아이콘 여부
 */
function Hamburger({ hasLogo, title, back, noIcon }) {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const goBack = () => {
		navigate(-1);
		window.scrollTo(0, 0);
	};

	// 풀스크린 메뉴 활성 시 전체 교체
	if (isMenuOpen) {
		return <FullScreenMenu onClose={() => setIsMenuOpen(false)} />;
	}

	return (
		<Container>
			<ButtonArea>
				{back ? (
					<ChevronLeftPink alt="뒤로가기" height={15} onClick={goBack} />
				) : hasLogo ? (
					<Logo />
				) : (
					<HamburgerIcon
						alt="햄버거바"
						height={15}
						onClick={() => setIsMenuOpen(true)}
					/>
				)}

				{title && <Title>{title}</Title>}

				{!noIcon && (
					<Right>
						<Alrert alt="알림" onClick={() => navigate('/notification')} />
						<Search alt="검색" onClick={() => navigate('/search')} />
					</Right>
				)}
			</ButtonArea>
		</Container>
	);
}

export default Hamburger;

const ChevronLeftPink = styled(ChevronLeft)`
	color: ${({ theme }) => theme.colors.pink600};
	height: 15px;
`;
const Container = styled.div`
	height: 120px;
	background: ${({ theme }) => theme.colors.ivoryBg};

	position: relative;
	padding: 0px 20px;
`;

const ButtonArea = styled.div`
	position: absolute;
	bottom: 20px;
	left: 20px;
	right: 20px;

	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);

	font-size: ${({ theme }) => theme.font.fontSize.title16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.grayMain};
`;

const Right = styled.div`
	display: flex;
	gap: 12px;
`;
