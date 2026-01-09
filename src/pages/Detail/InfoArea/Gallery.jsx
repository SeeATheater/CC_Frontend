import styled from 'styled-components';

import useCustomFetch from '@/utils/hooks/useCustomFetch';

import Masonry from '@/components/Masonry';

function Gallery(props) {
	//console.log(props.data.result.memberId);

	const {
		data: picData,
		error,
		loading,
	} = useCustomFetch(`/photoAlbums/member/${props?.data.result.memberId}`);

	//console.log('error:', error);
	//console.log('loading:', loading);
	//console.log('data:', picData);

	return (
		<Container>
			<Masonry imageData={picData} />
		</Container>
	);
}

export default Gallery;

const Container = styled.div`
	width: 100%;
`;
