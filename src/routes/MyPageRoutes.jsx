import { Route, Routes } from 'react-router-dom';
import MyPage from '@/pages/mypage/MyPage';
import MyPageMenu from '@/pages/mypage/MyPageMenu';
import MyTickets from '@/pages/mypage/ticket/MyTickets';
import TicketDetail from '@/pages/mypage/ticket/TicketDetail';
import TicketCancel from '@/pages/mypage/ticket/TicketCancel';
import TicketCancelComplete from '@/pages/mypage/ticket/TicketCancelComplete';
import AccountConnection from '@/pages/mypage/account-connection/AccountConnection';
import LikedTheater from '@/pages/mypage/liked-theater/LikedTheater';
import AboutCC from '@/pages/mypage/about-cc/AboutCC';
import RegisteredPerformances from '@/pages/mypage/ADMIN/registered-performances/RegisteredPerformances';
import RegisteredDetail from '@/pages/mypage/ADMIN/registered-performances/RegisteredDetail';
import BookingHistory from '@/pages/mypage/booking-history/BookingHistory';
import MyPost from '@/pages/mypage/mypost/MyPost';
import MyQueryPage from '@/pages/mypage/query/MyQueryPage';

function MyPageRoutes() {
	return (
		<Routes>
			<Route path="/" element={<MyPage />}>
				<Route index element={<MyPageMenu />} />
				<Route path="tickets" element={<MyTickets />} />
				<Route path="tickets/:ticketId" element={<TicketDetail />} />
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
				<Route path="myposts" element={<MyPost />} />
				<Route path="query/*" element={<MyQueryPage />} />
			</Route>
		</Routes>
	);
}

export default MyPageRoutes;
