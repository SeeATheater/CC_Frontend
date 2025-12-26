import ImageUploadBox from '@/components/ImageUploadBox.jsx';
import { RegisterWrapper } from './Register.style.js';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
function RegisterStep2() {
	const { nextStep, formData, setFormData } = useOutletContext();
	const [errors, setErrors] = useState({
		notice: {
			content: '',
			noticeImageUrl: '',
			timeInfo: '',
		},
	});
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		// tickets 배열 업데이트 처리
		if (name.startsWith('tickets.')) {
			const [_, index, field] = name.split('.'); // ["tickets", "0", "discountName"]
			setFormData((prev) => {
				const updatedTickets = [...prev.tickets];
				updatedTickets[Number(index)][field] = value;
				return { ...prev, tickets: updatedTickets };
			});
		} else if (name.includes('.')) {
			const keys = name.split('.'); // ['notice', 'timeInfo']

			setFormData((prev) => {
				return {
					...prev,
					[keys[0]]: {
						...prev[keys[0]],
						[keys[1]]: value,
					},
				};
			});
		} else {
			// 일반 필드 업데이트
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
		console.log(formData);
	};

	const handleNoticeImageUpload = (fileInfo) => {
		console.log('포스터 파일정보', fileInfo);
		// fileInfo는 { keyName: "...", imageUrl: "..." } 형태라고 가정
		setFormData((prev) => ({
			...prev,
			notice: {
				...prev.notice, // ✅ 기존 notice만 펼치기
				noticeImageRequestDTO: {
					keyName: fileInfo?.keyName || '',
					imageUrl: fileInfo?.imageUrl || '',
				}, // ✅ imageUrl 반영
			},
		}));
		console.log('포스터 등록 확인', formData);
	};
	// 제출 시 전체 검증
	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {
			notice: {},
		};
		// 기본 정보
		if (!formData.notice.timeInfo)
			newErrors.notice.timeInfo = '공연 시간 정보는 필수입니다.';
		if (!formData.notice.content)
			newErrors.notice.content = '공지사항은 필수입니다.';

		setErrors(newErrors);
		console.log(newErrors);
		if (!newErrors.notice.timeInfo) {
			console.log(formData);
			nextStep();
		}
	};
	return (
		<RegisterWrapper>
			<form>
				<h1>공연 정보</h1>
				<div>
					<label>공연시간 정보</label>
					<textarea
						name="notice.timeInfo"
						placeholder="예매 가능 시간이나 공연 시간에 대해 입력하세요 (1,000자 이하) 
예) 공연 관람 3시간 전까지 예매 가능"
						value={formData.notice.timeInfo}
						onChange={handleInputChange}
					/>
					{errors.notice.timeInfo && (
						<Err style={{ color: 'red' }}>{errors.notice.timeInfo}</Err>
					)}
				</div>
				<div>
					<label>공지사항</label>
					<textarea
						name="notice.content"
						placeholder="예) 예매시에 공연 관리자가 안내하는 입금계좌로 입금하시고,
공연 관리자의 입금 확인을 통해 티켓 예매 확인을 받을 수 
있습니다. 공연 관리자가 입금을 확인해야 하므로 티켓 확인까지 
시간이 걸릴 수 있습니다."
						value={formData.notice.content}
						onChange={handleInputChange}
					/>
					{errors.notice.content && (
						<Err style={{ color: 'red' }}>{errors.notice.content}</Err>
					)}
				</div>
				<div>
					<label style={{ marginBottom: '6px' }}>공연 상세 이미지</label>
					<p>(선택사항)</p>
					<ImageUploadBox
						onUploadSuccess={handleNoticeImageUpload}
						width="157px"
						height="220px"
						webWidth="228px"
						webHeight="320px"
						filePath="notice"
					/>
				</div>
				{/*	<div>
					<label style={{ marginBottom: '6px' }}>공연장 사진</label>
					<p>(사진을 등록하면 자동으로 시야확인에 추가됩니다.)</p>
					<ImageUploadBox />
				</div>*/}
			</form>
			<button
				style={{ marginTop: '44px' }}
				type="submit"
				className="btn-primary"
				onClick={handleSubmit}
			>
				다음
			</button>
		</RegisterWrapper>
	);
}

export default RegisterStep2;
const Err = styled.p``;
