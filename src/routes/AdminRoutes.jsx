import { Route, Routes } from 'react-router-dom';
import Admin from '@/pages/admin/Admin';
import Dashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users.jsx';
import UsersDetail from '@/pages/admin/UsersDetail.jsx';
import AdminGallery from '@/pages/admin/AdminGallery.jsx';
import GalleryDetail from '@/pages/admin/GalleryDetail.jsx';
import AdminPlays from '@/pages/admin/plays/AdminPlays.jsx';
import PlaysDetail from '@/pages/admin/plays/PlaysDetail.jsx';
import AdminPlayRegister from '@/pages/admin/plays/AdminPlayRegister.jsx';
import AdminPlayReview from '@/pages/admin/plays/AdminPlayReview.jsx';
import RegisterRequests from '@/pages/admin/register-request/RegisterRequests.jsx';
import RegisterRequestDetail from '@/pages/admin/register-request/RegisterRequestDetail.jsx';
import TicketManagement from '@/pages/admin/tickets/TicketManagement.jsx';
import TicketManagementDetail from '@/pages/admin/tickets/TicketManagementDetail.jsx';
import ReservationManagement from '@/pages/admin/reservation/ReservationManagement.jsx';
import ReservationManagementDetail from '@/pages/admin/reservation/ReservationManagementDetail.jsx';
import RefundManagement from '@/pages/admin/refund/RefundManagement.jsx';
import RefundDetail from '@/pages/admin/refund/RefundDetail.jsx';
import Inquiry from '@/pages/admin/Inquiry.jsx';
import InquiryDetail from '@/pages/admin/InquiryDetail.jsx';
import MyPageManagement from '@/pages/admin/mypage/MypageManagement.jsx';
import BoardManage from '@/pages/admin/board/BoardManage';
import BoardManageDetail1 from '@/pages/admin/board/BoardManageDetail1';
import BoardManageDetail2 from '@/pages/admin/board/BoardManageDetail2';

function AdminRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Admin />}>
				<Route path="dashboard" element={<Dashboard />} />

				<Route path="users" element={<Users />} />
				<Route path="users/:userId" element={<UsersDetail />} />

				<Route path="gallery" element={<AdminGallery />} />
				<Route path="gallery/:galleryId" element={<GalleryDetail />} />

				<Route path="plays" element={<AdminPlays />} />
				<Route path="plays/:playId" element={<PlaysDetail />} />
				<Route path="plays/:playId/register" element={<AdminPlayRegister />} />
				<Route path="plays/:playId/review" element={<AdminPlayReview />} />

				<Route path="register-requests" element={<RegisterRequests />} />
				<Route
					path="register-requests/:registerId"
					element={<RegisterRequestDetail />}
				/>

				<Route path="tickets" element={<TicketManagement />} />
				<Route path="tickets/:ticketId" element={<TicketManagementDetail />} />

				<Route path="reservations" element={<ReservationManagement />} />
				<Route
					path="reservations/:id"
					element={<ReservationManagementDetail />}
				/>

				<Route path="refunds" element={<RefundManagement />} />
				<Route path="refunds/:refundId" element={<RefundDetail />} />

				<Route path="board" element={<BoardManage />} />
				<Route path="board/:id" element={<BoardManageDetail1 />} />
				<Route path="board/:id/comments" element={<BoardManageDetail2 />} />

				<Route path="inquiry" element={<Inquiry />} />
				<Route path="inquiry/:inquiryId" element={<InquiryDetail />} />

				<Route path="mypage" element={<MyPageManagement />} />
			</Route>
		</Routes>
	);
}

export default AdminRoutes;
