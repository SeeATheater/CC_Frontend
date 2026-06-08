import styled from 'styled-components';
import { RegisterWrapper } from './Register.style.js';
import { useOutletContext } from 'react-router-dom';
import useAxios from '@/utils/hooks/useAxios';
function RegisterStep4() {
	const { nextStep, formData, _setFormData } = useOutletContext();
	const axiosClient = useAxios();
	const handleEnroll = async (e) => {
		e.preventDefault(); // 폼 제출 기본 동작 막기
		console.log('폼데이터', formData);

		try {
			const { data } = await axiosClient.post('/amateurs/enroll', formData);
			console.log('등록 성공:', data);

			alert('공연 등록이 완료되었습니다.');
			localStorage.setItem('등록한 공연 id', data?.result?.amateurShowId);
			nextStep();
		} catch (err) {
			console.error(err);
			alert('등록 중 오류가 발생했습니다.');
		}
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<div className="only-mobile" style={{ height: '100%' }}>
				<RegisterWrapper>
					<form style={{ height: '100%', justifyContent: 'space-between' }}>
						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
						>
							<h1>참고 사항</h1>
							<ul>
								<li>
									<span>1.</span>
									<p>기본 수수료는 5,000원입니다.</p>
								</li>
								<li>
									<span>2.</span>
									<p>등록 후 관리자가 확인 후 페이지에 올라가게 됩니다.</p>
								</li>
								<li>
									<span>3.</span>
									<p>
										공연이 등록되는데 1일 정도 소요됩니다. 공연 인증되어 공연이
										등록되면 알람이 가며, 마이페이지에서도 확인이 가능합니다.
									</p>
								</li>
							</ul>
						</div>

						<div className="checkbox">
							<label>
								참고사항을 확인하였으며, 이에 동의합니다.
								<input type="checkbox" />
							</label>
						</div>
					</form>
					<button onClick={() => console.log(formData)}>데이터 확인</button>
					<button
						style={{ marginTop: '44px' }}
						type="button"
						className="btn-primary"
						onClick={handleEnroll}
					>
						등록하기
					</button>
				</RegisterWrapper>
			</div>
			<div
				className="only-web-flex"
				div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<WebWrapper>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div>
							<h1 style={{ marginBottom: '10px' }}>참고 사항</h1>
							<ul style={{ marginBottom: '40px' }}>
								<li>
									<span>1.</span>
									<p>기본 수수료는 5,000원입니다.</p>
								</li>
								<li>
									<span>2.</span>
									<p>등록 후 관리자가 확인 후 페이지에 올라가게 됩니다.</p>
								</li>
								<li>
									<span>3.</span>
									<p>
										공연이 등록되는데 1일 정도 소요됩니다. 공연 인증되어 공연이
										등록되면 알람이 가며, 마이페이지에서도 확인이 가능합니다.
									</p>
								</li>
							</ul>

							<div
								className="checkbox-register"
								style={{ marginBottom: '98px' }}
							>
								<strong>참고사항에 대해 동의하십니까?</strong>
								<label>
									<input type="checkbox" />
									동의합니다
								</label>
							</div>
						</div>

						<ButtonWrapper>
							<button className="btn-square-primary" onClick={handleEnroll}>
								등록하기
							</button>
							<button className="btn-square">취소</button>
						</ButtonWrapper>
					</div>
				</WebWrapper>
			</div>
		</div>
	);
}

export default RegisterStep4;

const WebWrapper = styled.div`
display: flex;

height: 60%;
	h1 {
		/*최상단 핑크색 제목 */
		color: ${({ theme }) => theme.colors.pink600};
		font-size: ${({ theme }) => theme.font.fontSize.headline20};
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
	.btn-square-primary {
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
