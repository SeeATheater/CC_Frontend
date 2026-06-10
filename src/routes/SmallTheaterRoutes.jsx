import { Navigate, Route, Routes } from 'react-router-dom';
import SmallTheaterCurrent from '@/pages/theater/SmallTheaterCurrent';
import SmallTheaterRegister from '@/pages/register/SmallTheaterRegister';
import RegisterStep1 from '@/pages/register/RegisterStep1';
import RegisterStep2 from '@/pages/register/RegisterStep2';
import RegisterStep3 from '@/pages/register/RegisterStep3';
import RegisterStep4 from '@/pages/register/RegisterStep4';
import RegisterStep5 from '@/pages/register/RegisterStep5';

function SmallTheaterRoutes() {
	return (
		<Routes>
			<Route path="current" element={<SmallTheaterCurrent />} />
			<Route path="register" element={<SmallTheaterRegister />}>
				<Route index element={<Navigate to="step1" replace />} />
				<Route path="step1" element={<RegisterStep1 />} />
				<Route path="step2" element={<RegisterStep2 />} />
				<Route path="step3" element={<RegisterStep3 />} />
				<Route path="step4" element={<RegisterStep4 />} />
				<Route path="step5" element={<RegisterStep5 />} />
			</Route>
		</Routes>
	);
}

export default SmallTheaterRoutes;
