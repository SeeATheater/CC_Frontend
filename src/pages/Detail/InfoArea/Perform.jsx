import styled from 'styled-components';
import KakaoMap from '@/components/KakaoMap';

function Perform(props) {
	console.log('show data:', props);

	return (
		<Container>
			<Content>
				<Title>줄거리</Title>
				<Summary>{props?.data.result.summary}</Summary>
			</Content>

			<Content>
				<Title>공연시간 정보</Title>
				<Text>{props?.data.result.notice.timeInfo}</Text>
			</Content>
			<Content>
				<Title>공연장 정보</Title>
				<>
					<Location>
						<div className="textArea">
							<p className="additional">상세주소</p>
							<p>{props?.data.result.roadAddress}</p>
							<p className="copy">복사</p>
						</div>
						<div className="map" id="map">
							<KakaoMap
								location={props?.data.result.roadAddress}
								hallName={props?.data.result.hallName}
							/>
						</div>
					</Location>
					<WebLocation>
						<p>{props?.data.result.roadAddress}</p>
						<div className="map" id="map">
							<KakaoMap
								location={props?.data.result.roadAddress}
								hallName={props?.data.result.hallName}
							/>
						</div>
					</WebLocation>
				</>
			</Content>

			<Content>
				<Title>포스터 </Title>
				<img
					src={props?.data.result.notice.noticeImageUrl}
					className="Poster"
					alt="포스터"
				/>
			</Content>
		</Container>
	);
}

export default Perform;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
`;
const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	.Poster {
		width: 80%;
		align-self: center;

		@media (min-width: 768px) {
			width: 400px;
			border-radius: 5px;
		}
	}
`;

const Title = styled.div`
	font-size: ${({ theme }) => theme.font.fontSize.body16};
	font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	color: ${({ theme }) => theme.colors.pink500};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.body16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const Summary = styled.div`
	width: 100%;

	background: ${({ theme }) => theme.colors.gray200};
	padding: 12px 20px;
	border-radius: 3px;

	font-size: ${({ theme }) => theme.font.fontSize.body13};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const Text = styled.div`
	width: 100%;

	font-size: ${({ theme }) => theme.font.fontSize.body13};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;
const Location = styled.div`
	.textArea {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		margin-bottom: 20px;
	}
	.additional {
		color: ${({ theme }) => theme.colors.gray400};
	}
	.copy {
		color: ${({ theme }) => theme.colors.pink400};
	}
	.map {
		width: 100%;
		height: 148px;
		//background: ${({ theme }) => theme.colors.gray300};
	}
	font-size: ${({ theme }) => theme.font.fontSize.body13};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};

	@media (min-width: 768px) {
		display: none;
	}
`;
const WebLocation = styled.div`
	display: none;

	@media (min-width: 768px) {
		display: flex;
		flex-direction: column;
		gap: 20px;

		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
		.map {
			width: 100%;
			height: 148px;
			background: ${({ theme }) => theme.colors.gray300};
		}
	}
`;
