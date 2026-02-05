import styled from 'styled-components';
import HomeIconMenu from '@/components/HomeIconMenu';
import Hr from '@/components/Hr';
import Ranking from '@/components/Ranking';
import ChevronRight from '@/assets/icons/chevronRight.svg?react';
import BoardPreviewCardList from '@/components/BoardPreviewCardList';
import BoardPreviewList from '@/components/BoardPreviewList';
import BoardPreviewCardWeb from '@/components/BoardPreviewCardWeb';
import SearchPC from '@/pages/search/SearchPC';
import CarouselWeb from '@/components/CarouselWeb';
import CarouselMobile from '@/components/CarouselMobile';
import Hamburger from '@/components/Hamburger';
import Poster from '@/assets/images/test-poster2.png';

import useCustomFetch from '@/utils/hooks/useCustomFetch.js';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

function Home() {
	const navigate = useNavigate();
	const role = sessionStorage.getItem('selectedRole');

	const {
		data: dataClosing,
		loading: loadingClosing,
		error: errorClosing,
	} = useCustomFetch('/amateurs/closing');

	const {
		data: dataRanking,
		loading: loadingRanking,
		error: errorRanking,
	} = useCustomFetch('/amateurs/ranking');

	console.log('데이터 랭킹', dataRanking);
	const {
		data: dataHotBoard,
		// loading: loadingHotBoard,
		// error: errorHotBoard,
	} = useCustomFetch('/boards/hot');

	console.log('핫게데이터', dataHotBoard);
	const {
		data: dataBoard,
		// loading: loadingBoard,
		// error: errorBoard,
	} = useCustomFetch('/boards/all?page=0&size=5');

	console.log('오늘 마감인 공연', dataClosing?.result);
	return (
		<HomeWrapper>
			<SideMenuWrapper>
				<HomeIconMenu isWeb={true} />
			</SideMenuWrapper>
			<MainContent>
				<div className="only-mobile">
					<Hamburger hasLogo={true} />
				</div>
				<Wrapper>
					<div
						className="only-web"
						style={{ marginBottom: '40px' }}
					>
						<SearchPC />
					</div>
					<h1>오늘 마감인 공연</h1>
					<div className="only-web">
						{dataClosing?.result && (
							<CarouselWeb banners={dataClosing?.result} />
						)}
					</div>
					<div className="only-mobile">
						{dataClosing?.result && <CarouselMobile banners={dataClosing?.result}  />}
					</div>
					<div className="only-mobile">
						<HomeIconMenu />
					</div>
				</Wrapper>
				<div className="only-mobile">
					<Hr />
				</div>
				<Wrapper style={{ paddingRight: '0px' }}>
					<Bar >
					<div style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems:'center'}} onClick={() => navigate('/board')}>
					<h1 style={{ margin: 0, lineHeight: 1 }}>
						✨소극장 공연
					</h1> <ChevronRight />
					</div>
					</Bar>
					{dataRanking?.result && <Ranking data={dataRanking.result} />}
				{role == 'AUDIENCE' && <>
					<div style={{ paddingRight: '20px' }}>
						<button className="light only-mobile" onClick={() => navigate('/plays')} style={{ marginTop: '26px' }}>
							소극장 공연 보러가기
						</button>
						
					</div>
				</>}
				
				</Wrapper>
				{role == 'PERFORMER' && <>
				<div className='only-web'>
				<RegisterButton
					onClick={() => navigate('/small-theater/register/step1')}
				>
					<p>공연을 준비하고 있다면?</p>
					<h1>공연 등록하러가기</h1>
				</RegisterButton>
				</div>
				<div className='only-mobile'>
				<RegisterButtonMobile
					onClick={() => navigate('/small-theater/register/step1')}
				>
					<p>공연을 준비하고 있다면?</p>
					<h1>공연 등록하러가기</h1>
				</RegisterButtonMobile>
				</div>
				</>}

				
				{/*게시판 섹선*/}
				<Wrapper style={{ paddingRight: '0px' }}>
					<h1 className="only-mobile">게시판</h1>
					<Bar >
						<div style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems:'center',}} onClick={() => navigate('/board')}>
						<h1 style={{ margin: 0, lineHeight: 1 }}>
							🔥지금 HOT 게시판 
						</h1>
						{/*TODO: 오른쪽 화살표 정렬 수정 예정)*/}
						<ChevronRight />
						</div>
						
					</Bar>
					<div className="only-mobile">
						<BoardPreviewCardList data={dataHotBoard} />
					</div>
					<div className="only-web" style={{ paddingRight: '60px' }}>
					
						<BoardPreviewCardWeb data={dataHotBoard} />
					</div>

					<div style={{ paddingRight: '20px' }}>
						<BoardPreviewList data={dataBoard?.result?.content} />
					</div>
					<div style={{ paddingRight: '20px', marginTop: '28px' }}>
						<button className="light only-mobile" onClick={()=>navigate('/board')}>게시판 보러가기</button>
					</div>
				</Wrapper>
				<Footer />
			</MainContent>
		</HomeWrapper>
	);
}
export default Home;

const HomeWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

const SideMenuWrapper = styled.div`
	width: 101px;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	flex-shrink: 0;
	display: none;
	background-color: ${({ theme }) => theme.colors.grayWhite};
	@media (min-width: 768px) {
		display: block;
	}
`;

const MainContent = styled.div`
	flex-grow: 1;
	min-width: 0;
	@media (min-width: 768px) {
		padding-left: 100px;
	}
`;
const Wrapper = styled.div`
	padding: 28px 20px 12px 20px;
	@media (min-width: 768px) {
		padding: 60px;
		padding-bottom: 0px;
	}
	h1 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.48px;
		margin-bottom: 24px;
		@media (min-width: 768px) {
			font-size: ${({ theme }) => theme.font.fontSize.headline20} !important;
		}import { RegisterButton } from './../board/styles/formStyles';

	}
	button {
		display: flex;
		width: 100%;
		height: 36px;
		padding: 8px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.light {
		color: ${({ theme }) => theme.colors.pink600};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.42px;
		border-radius: 3px;
		border: 1px solid ${({ theme }) => theme.colors.pink200};
		background: ${({ theme }) => theme.colors.pink200};
	}
`;
const Bar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 24px;
	margin-bottom: 24px;
	padding-right: 20px;
	@media (min-width: 768px) {
		justify-content: flex-start;
		gap: 20px;
		margin-bottom: 20px;
	}
`;
const RegisterButton = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	
	background: ${({ theme }) => theme.colors.pink200};
	height: 92px;
	margin: 30px 60px 0px 60px;

	p {
		color: ${({ theme }) => theme.colors.pink600};
	}
	h1 {
		color: ${({ theme }) => theme.colors.pink600};
		font-size: 20px;
	}
`;
const RegisterButtonMobile = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	

	background: ${({ theme }) => theme.colors.pink200};
	padding: 8px;
	margin: 30px 20px 0px 20px;

	p {
	font-size: 14px;	
		color: ${({ theme }) => theme.colors.pink600};
	}
	h1 {
		color: ${({ theme }) => theme.colors.pink600};
		font-size: 16px;
	}
`;
