import { Route, Routes } from 'react-router-dom';
import FullScreenMenu from './components/FullScreenMenu';

// 아래는 각 페이지를 담당할 컴포넌트들
import Onboarding from './pages/login/Onboarding.jsx';
import Login from './pages/login/Login.jsx';
import KakaoCallback from './pages/login/KakaoCallback.jsx';
import Logout from './pages/logout/Logout';
import Withdrawal from './pages/withdrawal/Withdrawal';

import SmallTheaterRoutes from './routes/SmallTheaterRoutes.jsx';

import Home from './pages/home/Home';
import TicketingPage from './pages/ticketingpage/TicketingPage.jsx';
import KakaoPayApprove from './pages/ticketingpage/pages/KakaoPayApprove.jsx';
import Board from './pages/board/Board';
import Gallery from './pages/gallery/Gallery';
import Info from './pages/info/Info';
import Detail from './pages/Detail/Detail';
import Playlist from './pages/Detail/Playlist';
import Notification from './pages/notification/Notification';
import UploadPic from './pages/production/UploadPic';
import ProdDetail from './pages/production/ProdDetail';
import Production from './pages/production/Production';
import MyPageRoutes from './routes/MyPageRoutes.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TestUploadPic from './pages/TEST/TestUploadPic';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Onboarding />} />

			<Route path="/login" element={<Login />} />
			<Route path="/auth/kakao/callback" element={<KakaoCallback />} />
			<Route path="/logout" element={<Logout />} />
			<Route path="/withdrawal" element={<Withdrawal />} />

			<Route path="/home" element={<Home />} />
			<Route path="/menu" element={<FullScreenMenu />} />

			<Route path="/small-theater/*" element={<SmallTheaterRoutes />} />

			<Route path="/ticketing/:playId" element={<TicketingPage />} />
			<Route path="/kakaoPay/approve" element={<KakaoPayApprove />} />
			<Route path="/board/*" element={<Board />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/info" element={<Info />} />

			<Route path="/plays" element={<Playlist />} />
			<Route path="/plays/detail/:playId" element={<Detail />} />

			<Route path="/notification" element={<Notification />} />
			<Route path="/production/:prodId" element={<Production />} />
			<Route path="/production/:prodId/:AlbumId" element={<ProdDetail />} />
			<Route path="/production/upload_photo" element={<UploadPic />} />

			<Route path="/mypage/*" element={<MyPageRoutes />} />

			<Route path="/admin/*" element={<AdminRoutes />} />

			<Route path="*" element={<NotFoundPage />} />

			<Route path="test/upload-pic" element={<TestUploadPic />} />
		</Routes>
	);
}
export default App;