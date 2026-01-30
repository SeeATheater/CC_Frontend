import Summary from '@/pages/Detail/Summary';
import Info from '@/pages/Detail/Info';
import { useParams } from 'react-router-dom';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

import EyeRollingSVG from '@/components/EyeRollingSVG.jsx';
import Footer from '@/components/Footer';

function Detail() {
	const { playId } = useParams();

	const {
		data: playData,
		error,
		loading,
	} = useCustomFetch(`/amateurs/${playId}`);

	//console.log('error:', error);
	//console.log('loading:', loading);
	//console.log('SummData:', playData);

	if (loading || !playData?.result) {
		return <EyeRollingSVG />;
	}

	return (
		<>
			{/*스크롤 전 요약 화면*/}
			<Summary playData={playData} />

			{/*스크롤 후 상세 화면*/}
			<Info playData={playData} />
			<Footer />
		</>
	);
}

export default Detail;
