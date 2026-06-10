import { RegisterWrapper } from './Register.style.js';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
function RegisterStep5() {
	const navigate = useNavigate();
	return (
		<div style={{ height: '100%' }}>
			<div className="only-mobile" style={{ height: '100%' }}>
				<RegisterWrapper>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flex: '1',
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<h1>등록 완료!</h1>
							<p>관리자 승인 후 공연 목록에 공개됩니다.</p>
						</div>
					</div>

					<button
						type="submit"
						className="btn-primary"
						onClick={() => navigate('/plays')}
					>
						공연 목록으로 돌아가기
					</button>
				</RegisterWrapper>
			</div>
			<div className="only-web" div style={{ height: '100%', width: '100%' }}>
				<WebWrapper>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<h1 style={{ marginBottom: '16px' }}>공연이 등록되었습니다</h1>
						<p style={{ marginBottom: '60px' }}>
							관리자 승인 후 공연 목록에 공개됩니다.
						</p>

						<ButtonWrapper>
							<button
								className="btn-square"
								onClick={() => navigate('/plays')}
							>
								공연 목록으로 돌아가기
							</button>
						</ButtonWrapper>
					</div>
				</WebWrapper>
			</div>
		</div>
	);
}

export default RegisterStep5;

const WebWrapper = styled.div`
display: flex;

height: 100%;
width: 100%;
justify-content: center;
	h1 {
		/*최상단 핑크색 제목 */
		color: ${({ theme }) => theme.colors.pink600};
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-style: normal;
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		line-height: normal;
		letter-spacing: -0.6px;
		margin-bottom: 6px;

		@media (min-width: 768px) {
			font-size: 24px;
		}
	}
	ul {
		/* 마지막 참고사항 페이지에 사용 */
		list-style-type: none;

		li {
			display: flex;
			gap: 8px;
			color: ${({ theme }) => theme.colors.grayMain};
			font-size: ${({ theme }) => theme.font.fontSize.body14};
			font-style: normal;
			font-weight: ${({ theme }) => theme.font.fontWeight.bold};
			line-height: normal;
			letter-spacing: -0.42px;
			margin-bottom: 16px;
			@media (min-width: 768px) {
				margin-bottom: 4px;
			}
			p {
				color: ${({ theme }) => theme.colors.grayMain} !important;
			}
		}
	}
	strong {
		color: #000;

		/* Web-app/title-16-extrabold */
		font-family: 'NanumSquare Neo OTF';
		font-size: 16px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		letter-spacing: -0.48px;
	}
	.checkbox-register {
		color: var(--Gray-maintext, #000);
		text-align: center;

		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 18px; /* 128.571% */

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 21px;
	}


}
`;

const ButtonWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	min-width: 400px;
	s .btn-square-primary {
		width: 80%;
		display: flex;

		padding: 8px;

		align-items: center;

		flex-shrink: 0;
		border-radius: 3px;
		border: 1px solid ${({ theme }) => theme.colors.pink600};
		background: ${({ theme }) => theme.colors.pink600};
		color: ${({ theme }) => theme.colors.grayWhite};
		font-size: 16px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		letter-spacing: -0.48px;
		display: flex;

		height: 40px;

		justify-content: center;

		gap: 10px;
		flex-shrink: 0;
		&:disabled {
			border: 1px solid ${({ theme }) => theme.colors.gray300};
			background: ${({ theme }) => theme.colors.gray300};
			color: ${({ theme }) => theme.colors.gray200};
		}
	}
	.btn-square {
		display: flex;
		width: 80%;
		padding: 8px;

		align-items: center;

		flex-shrink: 0;
		border-radius: 3px;
		border: 1px solid var(--Gray-outline, #e6e6e6);

		color: ${({ theme }) => theme.colors.grayMain};
		font-size: 16px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		letter-spacing: -0.48px;
		display: flex;

		height: 40px;

		justify-content: center;

		gap: 10px;
		flex-shrink: 0;
	}
`;
