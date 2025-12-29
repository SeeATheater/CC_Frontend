import ImageUploadBox from '@/components/ImageUploadBox.jsx';
import styled from 'styled-components';
import { RegisterWrapper } from './Register.style.js';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
function RegisterStep3() {
	const { nextStep, formData, setFormData } = useOutletContext();

	// 초기값 설정
	useEffect(() => {
		if (!formData.casting || formData.casting.length === 0) {
			setFormData((prev) => ({
				...prev,
				casting: [{ actorName: '', castingName: '', castingImageUrl: '' }],
			}));
		}
		if (!formData.staff || formData.staff.length === 0) {
			setFormData((prev) => ({
				...prev,
				staff: [{ position: '', staffName: '' }],
			}));
		}
	}, []);

	// 배우 추가
	const addActor = () => {
		setFormData((prev) => ({
			...prev,
			casting: [
				...prev.casting,
				{ actorName: '', castingName: '', castingImageUrl: '' },
			],
		}));
	};

	// 스태프 추가
	const addStaff = () => {
		setFormData((prev) => ({
			...prev,
			staff: [...prev.staff, { position: '', staffName: '' }],
		}));
	};

	// 배우 입력값 변경
	const handleActorChange = (index, field, value) => {
		setFormData((prev) => {
			const updated = [...prev.casting];
			updated[index][field] = value;
			console.log(formData.casting);
			return { ...prev, casting: updated };
		});
	};

	// 스태프 입력값 변경
	const handleStaffChange = (index, field, value) => {
		setFormData((prev) => {
			const updated = [...prev.staff];
			updated[index][field] = value;
			return { ...prev, staff: updated };
		});
	};

	// 배우 이미지 업로드
	const handleActorImageUpload = (index, fileInfo) => {
		handleActorChange(index, 'castingImageRequestDTO', {
			imageUrl: fileInfo.imageUrl,
			keyName: fileInfo?.keyName,
		});
	};
	return (
		<RegisterWrapper>
			<form>
				<h1>캐스팅 정보</h1>
				<div>
					{formData.casting.map((actor, idx) => (
						<ActorWrapper key={idx}>
							<div>
								<ImageUploadBox
									width="100px"
									height="100px"
									webWidth="160px"
									webHeight="160px"
									round="true"
									filePath="casting"
									onUploadSuccess={(fileInfo) =>
										handleActorImageUpload(idx, fileInfo)
									}
								/>
							</div>
							<Right>
								<input
									className="input-text"
									type="text"
									placeholder="배우 이름을 입력하세요"
									value={actor.actorName}
									onChange={(e) =>
										handleActorChange(idx, 'actorName', e.target.value)
									}
								/>
								<input
									type="text"
									placeholder="역할을 입력하세요"
									className="input-text"
									style={{ marginBottom: '0px' }}
									value={actor.castingName}
									onChange={(e) =>
										handleActorChange(idx, 'castingName', e.target.value)
									}
								/>
							</Right>
						</ActorWrapper>
					))}
					<button
						type="button"
						className="btn-add"
						onClick={addActor}
						style={{ marginBottom: '24px' }}
					>
						+ 추가하기
					</button>

					<label>감독 및 스태프</label>
					{formData.staff.map((staff, idx) => (
						<DirectorWrapper key={idx}>
							<input
								type="text"
								placeholder="역할"
								className="input-text"
								value={staff.position}
								onChange={(e) =>
									handleStaffChange(idx, 'position', e.target.value)
								}
							/>
							<input
								type="text"
								placeholder="이름을 입력하세요"
								className="input-text"
								value={staff.staffName}
								onChange={(e) =>
									handleStaffChange(idx, 'staffName', e.target.value)
								}
							/>
						</DirectorWrapper>
					))}

					<button
						type="button"
						className="btn-add"
						onClick={addStaff}
						style={{ marginBottom: '24px', marginTop: '8px' }}
					>
						+ 추가하기
					</button>
				</div>
			</form>
			<button
				style={{ marginTop: '44px' }}
				type="submit"
				className="btn-primary"
				onClick={nextStep}
			>
				다음
			</button>
		</RegisterWrapper>
	);
}

export default RegisterStep3;

const Right = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
`;

const ActorWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
	@media (min-width: 768px) {
		gap: 40px;
	}
`;

const DirectorWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	gap: 16px;
	& .input:first-child {
		flex: 1;
	}

	& .input:last-child {
		flex: 2;
	}
`;

const Contents = styled.div``;
