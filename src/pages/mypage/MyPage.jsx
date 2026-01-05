import styled from 'styled-components';
import HomeIconMenu from '@/components/HomeIconMenu';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

function MyPage() {
	return (
		<MypageWrapper>
			<SideMenuWrapper>
				<HomeIconMenu isWeb={true} selectedMenu="mypage" />
			</SideMenuWrapper>
			<Wrapper>
				<Outlet />
			</Wrapper>
			
		</MypageWrapper>
	);
}
export default MyPage;

const MypageWrapper = styled.div`
display:flex;
flex-direction: column;
flex:1;
height: 100vh;
`
const SideMenuWrapper = styled.div`
	width: 101px;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	flex-shrink: 0;
	display: none;
	background: ${({ theme }) => theme.colors.grayWhite};
	@media (min-width: 768px) {
		display: block;
	}
`;

const Wrapper = styled.div`
	display: flex;
	flex: 1;

	@media (min-width: 768px) {
		padding-left: 101px;
	}
`;
