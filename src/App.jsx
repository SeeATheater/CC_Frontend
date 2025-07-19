import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullScreenMenu from './components/FullScreenMenu';

// 아래는 각 페이지를 담당할 컴포넌트들
import Home from './pages/home/Home';
import SmallTheaterCurrent from './pages/theater/SmallTheaterCurrent';
import SmallTheaterRegister from './pages/register/SmallTheaterRegister';
import TicketingPage from './pages/ticketingpage/TicketingPage.jsx';
import Board from './pages/board/Board';
import Gallery from './pages/gallery/Gallery';
import Info from './pages/info/Info';
import MyPage from './pages/mypage/MyPage';
import Logout from './pages/logout/Logout';
import Withdrawal from './pages/withdrawal/Withdrawal';
import MyTickets from './pages/mypage/ticket/MyTickets';
import Detail from './pages/Detail/Detail';
import Playlist from './pages/Detail/Playlist';
import TicketDetail from './pages/mypage/ticket/TicketDetail';
import LikedTheater from './pages/mypage/liked-theater/LikedTheater';
import MyPageMenu from './pages/mypage/MypageMenu';
import Notification from './pages/notification/Notification';
import AboutCC from './pages/mypage/about-cc/AboutCC';
import RegisterStep1 from './pages/register/RegisterStep1';
import RegisterStep2 from './pages/register/RegisterStep2';
import RegisterStep3 from './pages/register/RegisterStep3';
import RegisterStep4 from './pages/register/RegisterStep4';
import RegisterStep5 from './pages/register/RegisterStep5';
import TicketCancelComplete from './pages/mypage/ticket/TicketCancelComplete';
import TicketCancel from './pages/mypage/ticket/TicketCancel';
import AccountConnection from './pages/mypage/account-connection/AccountConnection';
import RegisteredPerformances from './pages/mypage/ADMIN/resigsterd-performances/RegisteredPerformances';
import RegisteredDetail from './pages/mypage/ADMIN/resigsterd-performances/RegisteredDetail';
import BookingHistory from './pages/mypage/booking-history/BookingHistory';
import Admin from './pages/admin/Admin';
import Dashboard from './pages/admin/Dashboard';
import UploadPic from './pages/production/UploadPic';
import ProdDetail from './pages/production/ProdDetail';
import Production from './pages/production/Production';

import RegistrationManagement from './pages/admin/register-request/RegisterRequests.jsx';
import RegisterRequests from './pages/admin/register-request/RegisterRequests.jsx';
import RegisterRequestDetail from './pages/admin/register-request/RegisterRequestDetail.jsx';
import TicketManagement from './pages/admin/tickets/TicketManagement.jsx';
import ReservationManagement from './pages/admin/reservation/ReservationManagement.jsx';
import RefundManagement from './pages/admin/refund/RefundManagement.jsx';
import MyPageManagement from './pages/admin/mypage/MypageManagement.jsx';
import TicketManagementDetail from './pages/admin/tickets/TicketManagementDetail.jsx';
import ReservationManagementDetail from './pages/admin/reservation/ReservationManagementDetail.jsx';
import Users from './pages/admin/Users.jsx';
import AdminGallery from './pages/admin/AdminGallery.jsx';
import AdminPlays from './pages/admin/AdminPlays.jsx';
import UsersDetail from './pages/admin/UsersDetail.jsx';
import GalleryDetail from './pages/admin/GalleryDetail.jsx';
import PlaysDetail from './pages/admin/PlaysDetail.jsx';
import Inquiry from './pages/admin/Inquiry.jsx';
import InquiryDetail from './pages/admin/InquiryDetail.jsx';
import BoardManage from './pages/admin/board/BoardManage.jsx';
import BoardManageDetail1 from './pages/admin/board/BoardManageDetail1.jsx';
import BoardManageDetail2 from './pages/admin/board/BoardManageDetail2.jsx';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/small-theater/current"
					element={<SmallTheaterCurrent />}
				/>
				{/*<Route path="/ticketing" element={<TicketingPage />} />*/}
				<Route
					path="/small-theater/register"
					element={<SmallTheaterRegister />}
				>
					<Route path="step1" element={<RegisterStep1 />} />
					<Route path="step2" element={<RegisterStep2 />} />
					<Route path="step3" element={<RegisterStep3 />} />
					<Route path="step4" element={<RegisterStep4 />} />
					<Route path="step5" element={<RegisterStep5 />} />
				</Route>
				<Route path="/board" element={<Board />} />
				<Route path="/gallery" element={<Gallery />} />
				<Route path="/info" element={<Info />} />

				<Route path="/logout" element={<Logout />} />
				<Route path="/withdrawal" element={<Withdrawal />} />
				<Route path="/menu" element={<FullScreenMenu />} />

				<Route path="/mypage" element={<MyPage />}>
					<Route index element={<MyPageMenu />} />
					<Route path="tickets" element={<MyTickets />} />
					<Route path="tickets/1" element={<TicketDetail />} />
					<Route path="tickets/1/cancel" element={<TicketCancel />} />
					<Route
						path="tickets/1/cancel/complete"
						element={<TicketCancelComplete />}
					/>
					<Route path="account-connection" element={<AccountConnection />} />
					<Route path="liked-theater" element={<LikedTheater />} />
					<Route path="about-cc" element={<AboutCC />} />
					<Route
						path="registered-performances"
						element={<RegisteredPerformances />}
					/>
					<Route
						path="registered-performances/1"
						element={<RegisteredDetail />}
					/>
					<Route path="booking-history" element={<BookingHistory />} />
				</Route>
				<Route path="/plays" element={<Playlist />} />

				<Route path="/notification" element={<Notification />} />
				<Route path="/plays/detail/:playId" element={<Detail />} />

				<Route path="/production" element={<Production />} />
				<Route path="/production/:prodId" element={<ProdDetail />} />
				<Route path="/production/upload_photo" element={<UploadPic />} />

				<Route path="admin" element={<Admin />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="users" element={<Users />} />
					<Route path="gallery" element={<AdminGallery />} />
					<Route path="plays" element={<AdminPlays />} />
					<Route path="users/:userId" element={<UsersDetail />} />
					<Route path="gallery/:galleryId" element={<GalleryDetail />} />
					<Route path="plays/:playId" element={<PlaysDetail />} />
					<Route path="register-requests" element={<RegisterRequests />} />
					<Route
						path="register-requests/1"
						element={<RegisterRequestDetail />}
					/>
					<Route path="tickets" element={<TicketManagement />} />
					<Route path="tickets/1" element={<TicketManagementDetail />} />
					<Route path="reservations" element={<ReservationManagement />} />
					<Route
						path="reservations/1"
						element={<ReservationManagementDetail />}
					/>
					<Route path="refunds" element={<RefundManagement />} />
					<Route path="board" element={<BoardManage />} />
					<Route path="board/:id" element={<BoardManageDetail1 />} />
					<Route path="board/:id/comments" element={<BoardManageDetail2 />} />
					<Route path="inquiry" element={<Inquiry />} />
					<Route path="inquiry/:inquiryId" element={<InquiryDetail />} />
					<Route path="mypage" element={<MyPageManagement />} />
				</Route>
			</Routes>
		</>
	);
}
export default App;
