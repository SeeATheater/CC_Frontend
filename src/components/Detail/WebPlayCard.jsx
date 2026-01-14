import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function WebPlayCard({ name, posterImageUrl, place, schedule, amateurShowId }) {
	const navigate = useNavigate();
	const goDetail = () => {
		navigate(`detail/${amateurShowId}`);
		window.scrollTo(0, 0);
	};

	return (
		<Card image={posterImageUrl} onClick={goDetail}>
			<TextArea>
				<Text className="Title">{name}</Text>
				<Text className="Date">{schedule}</Text>
				<Text className="Location">{place}</Text>
			</TextArea>
		</Card>
	);
}

export default WebPlayCard;

const Card = styled.div`
	flex: 0 0 calc((100% - (12px * 2)) / 3);
	min-width: calc((100% - (12px * 2)) / 3);
	box-sizing: border-box;

	aspect-ratio: 1;
	background: ${({ image }) =>
		`linear-gradient(180deg, rgba(0, 0, 0, 0) 25.94%, rgba(0, 0, 0, 0.6) 77.94%),
		url(${image})`};
	border-radius: 5px;
	background-size: cover;
	background-position: center;

	position: relative;
`;
const TextArea = styled.div`
	position: absolute;
	left: 28px;
	bottom: 28px;

	display: flex;
	flex-direction: column;
`;
const Text = styled.div`
	color: ${({ theme }) => theme.colors.grayWhite};

	.Title {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};

		margin-bottom: 28px;
	}
	.Location {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};

		margin-bottom: 8px;
	}
	.Date {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	}
`;
