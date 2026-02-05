import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Close from '@/assets/icons/close.svg?react';
// menuData.js
function FullScreenMenu({ onClose }) {
	const navigate = useNavigate();
	const [activeMenu, setActiveMenu] = useState('');

	const menuItems = [
		{
			label: '홈',
			path: '/',
		},
		{
			label: '소극장 공연',
			subItems: [
				{ label: '현재 진행중인 소극장 공연', path: '/small-theater/current' },
				{ label: '소극장 공연 등록하기', path: '/small-theater/register' },
			],
		},
		{
			label: '게시판',
			path: '/board',
		},
		{
			label: '사진첩',
			path: '/gallery',
		},
		{
			label: '정보',
			path: '/info',
		},
		{
			label: '마이페이지',
			path: '/mypage',
		},
	];

	const handleClick = (label, path) => {
		setActiveMenu(label);
		navigate(path);
		onClose(); // 메뉴 닫기
	};

	return (
		<MenuWrapper>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
				}}
			>
				<Close onClick={onClose} />
			</div>
			<nav>
				<ul>
					{menuItems.map((item, index) => (
						<li key={index}>
							<div
								onClick={() => item.path && handleClick(item.label, item.path)}
								className={activeMenu === item.label ? 'danger' : ''}
							>
								{item.label}
							</div>
							{item.subItems && (
								<Ul>
									{item.subItems.map((subItem, subIndex) => (
										<li key={subIndex}>
											<div
												onClick={() => handleClick(subItem.label, subItem.path)}
												className={activeMenu === subItem.label ? 'danger' : ''}
											>
												{subItem.label}
											</div>
										</li>
									))}
								</Ul>
							)}
						</li>
					))}
				</ul>
				<div>
					<div onClick={() => handleClick('로그아웃', '/logout')}>로그아웃</div>
					<div
						style={{ paddingTop: '24px' }}
						className="color-warning"
						onClick={() => handleClick('회원 탈퇴', '/withdrawal')}
					>
						회원 탈퇴
					</div>
				</div>
			</nav>
		</MenuWrapper>
	);
}

export default FullScreenMenu;

const MenuWrapper = styled.div`
	position: fixed;
	width: 100%;
	height: 100vh;
	padding: 76px 16px 84px 16px;
	background-color: white;
	z-index: 1000;

	color: var(--color-gray-500, #696969);
	font-family: Inter;
	font-size: 14px;
	font-style: normal;
	font-weight: 800;
	line-height: normal;
	letter-spacing: -0.42px;

	nav {
		padding-top: 27px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		ul {
			padding: 0;
			margin: 0;

			> li {
				list-style: none;
				border-bottom: 1px solid #ddd; /* 원하는 색상 */
				padding: 16px 0;
			}
			> li:last-child {
				border: none;
			}

			/* 하위 ul 내부의 li에는 border 제거 */
			li ul li {
				border-bottom: none;
				padding: 16px 12px;
				&:last-child {
					padding: 12px 12px 0px 12px;
				}
			}
		}
	}
`;

const Ul = styled.ul`
	li:first-child {
		margin-top: 16px;
	}
`;
