import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

/**
 * 카카오페이 결제 완료 후
 * 서버 redirect를 받아 TicketingPage(Step3)로 넘겨주는
 * "진입 전용 페이지"
 */

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #F67676;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const KakaoPayComplete = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();

	useEffect(() => {
		const playId = params.get('playId');

		if (!playId) {
			navigate('/home', { replace: true });
			return;
		}

		navigate(`/ticketing/${playId}`, {
			replace: true,
			state: {
				paymentSuccess: true,
				step: 5,
			},
		});
	}, [navigate, params]);

	return (
		<Container>
			<Spinner />
		</Container>
	);
};

export default KakaoPayComplete;
