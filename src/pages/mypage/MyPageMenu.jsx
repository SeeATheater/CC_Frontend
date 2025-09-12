import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Hamburger from '@/components/Hamburger';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
function MyPageMenu() {
	const navigate = useNavigate();
	const role = localStorage.getItem('role');

	const {
		data,
		// loading, error
	} = useCustomFetch('/member/myPage', 'GET');

	const {
		data: image,
		// loading: imgloading,
		// error: imgerror,
	} = useCustomFetch('/images/2');

	console.log('image', image?.result?.imageUrl);

	const { name } = data?.result || {};
	if (data) {
		console.log(data?.result);
	}
	return (
		<div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
			<div className="only-mobile">
				<Hamburger />
			</div>

			<Wrapper>
				<LeftWrapper>
					<h1 className="title">마이페이지</h1>
					<h1 className="color-pink only-web" style={{ marginTop: '62px' }}>
						{name}
						<span className="bold">님</span>
					</h1>
					<button style={{ marginTop: '22px' }}>로그아웃</button>
				</LeftWrapper>
				<RightWrapper>
					<button
						onClick={() => {
							const current = localStorage.getItem('role');
							const next = current === 'admin' ? 'user' : 'admin';
							localStorage.setItem('role', next);
							window.location.reload();
						}}
					>
						역할 변경 버튼 (현재: {localStorage.getItem('role')})
					</button>

					<h1 className="color-pink only-mobile">
						{name}
						<span className="bold">님</span>
					</h1>
					<section>
						<h1>MY</h1>
						{role === 'admin' && (
							<ul>
								<li onClick={() => navigate('registered-performances')}>
									등록한 공연
								</li>
							</ul>
						)}
						{role === 'user' && (
							<ul>
								<li onClick={() => navigate('/mypage/tickets')}>내 티켓</li>
								<li>내가 쓴 글</li>
								<li onClick={() => navigate('/mypage/liked-theater')}>
									좋아요한 극단
								</li>
							</ul>
						)}
					</section>
					<section>
						<h1>계정 관리</h1>
						<ul>
							<li onClick={() => navigate('account-connection')}>
								계정 연결 설정
								<p className="extra">로그인 편의 기능을 활용</p>
							</li>
						</ul>
					</section>
					<section>
						<h1>기타</h1>
						<ul>
							<li>1:1 문의</li>
							<li onClick={() => navigate('/mypage/about-cc')}>CC 정보</li>
							<li className="color-warning">회원 탈퇴</li>
						</ul>
					</section>
				</RightWrapper>
			</Wrapper>
		</div>
	);
}
export default MyPageMenu;

const RightWrapper = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 40px;

	@media (min-width: 768px) {
		padding-left: min(10vw, 160px);
		flex: 0.9;
	}
`;
const LeftWrapper = styled.div`
	.title {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		letter-spacing: -0.72px;
	}
	@media (max-width: 768px) {
		display: none;
	}
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;

	@media (min-width: 768px) {
		padding-left: min(10vw, 160px);
		padding-top: 100px;
		flex: 0.9;
	}
	@media (max-width: 768px) {
	}
	h1 {
		color: ${({ theme }) => theme.colors.grayMain};
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.42px;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	li {
		list-style: none;
		display: flex;
		height: 40px;
		padding: 8px 20px;
		align-items: center;
		gap: 20px;
		border-radius: 3px;
		border: 1px solid ${({ theme }) => theme.colors.grayOutline};
	}
	.extra {
		color: ${({ theme }) => theme.colors.gray400};
		font-size: ${({ theme }) => theme.font.fontSize.body10};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extrabold};
		line-height: normal;
		letter-spacing: -0.3px;
	}
`;
