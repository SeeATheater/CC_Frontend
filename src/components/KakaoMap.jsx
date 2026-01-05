import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function KakaoMap({ location, hallName }) {
	const [coords, setCoords] = useState(null);

	useEffect(() => {
		if (!location) return;
		if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services)
			return;

		const geocoder = new window.kakao.maps.services.Geocoder();

		geocoder.addressSearch(location, (result, status) => {
			if (status === window.kakao.maps.services.Status.OK) {
				const lat = Number(result[0].y);
				const lng = Number(result[0].x);
				setCoords({ lat, lng });
			} else {
				console.error('주소 변환 실패:', status);
			}
		});
	}, [location]);

	return (
		<Map
			center={coords ?? { lat: 33.450701, lng: 126.570667 }}
			style={{ width: '100%', height: '100%' }}
			level={3}
		>
			{coords && <MapMarker position={coords} />}
		</Map>
	);
}

export default KakaoMap;
