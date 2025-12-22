import styled from 'styled-components';
import { RegisterWrapper } from './Register.style.js';
import ImageUploadBox from '@/components/ImageUploadBox.jsx';
import Counter from '@/components/Counter.jsx';
import DateInput from '@/components/DateInput.jsx';
import UnitInput from '@/components/UnitInput.jsx';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';
import PostCodeInput from '../../components/PostCodeInput.jsx';
function RegisterStep1() {
	const [formDataChanged, setFormDataChanged] = useState(false);
	const [roundCount, setRoundCount] = useState(1);
	const { nextStep } = useOutletContext();

	// 폼 데이터
	const { formData, setFormData } = useOutletContext();
	// 에러 상태
	const [errors, setErrors] = useState({});
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
		} else {
			// 일반 필드 업데이트
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
		setFormDataChanged(true);
		console.log(formData);
	};
	// 할인 항목 추가
	const handleAddTicket = () => {
		setFormData((prev) => ({
			...prev,
			tickets: [...prev.tickets, { discountName: '', price: '' }],
		}));
		setFormDataChanged(true);
	};

	// 할인 항목 삭제
	const handleRemoveTicket = (index) => {
		setFormData((prev) => {
			const updatedTickets = prev.tickets.filter((_, i) => i !== index);
			return { ...prev, tickets: updatedTickets };
		});
	};

	const handlePosterUpload = (fileInfo) => {
		console.log('포스터 파일정보', fileInfo);
		// fileInfo는 { keyName: "...", imageUrl: "..." } 형태라고 가정
		setFormData((prev) => ({
			...prev,
			posterImageRequestDTO: {
				keyName: fileInfo?.keyName,
				imageUrl: fileInfo?.imageUrl,
			},
		}));
		console.log('포스터 등록 확인', formData);
		setFormDataChanged(true);
	};

	const handleRoundChange = (index, field, value) => {
		const updatedRounds = [...formData.rounds];
		updatedRounds[index] = {
			...updatedRounds[index],
			[field]: value,
		};

		// 날짜만 정렬용으로 배열 만들기
		const validDates = updatedRounds
			.map((r) => r.performanceDateTime)
			.filter((d) => d); // 빈 값 제외

		let start = formData.start;
		let end = formData.end;

		if (validDates.length > 0) {
			// 오름차순 정렬
			const sorted = [...validDates].sort((a, b) => new Date(a) - new Date(b));

			start = sorted[0];
			end = sorted[sorted.length - 1];
		}

		setFormData((prev) => ({
			...prev,
			rounds: updatedRounds,
			start,
			end,
		}));
	};

	const changedRef = useRef(false);
	const formDataRef = useRef(formData);

	useEffect(() => {
		changedRef.current = formDataChanged;
		formDataRef.current = formData;
	}, [formDataChanged, formData]);
	useEffect(() => {
		const interval = setInterval(() => {
			if (formDataChanged) {
				localStorage.setItem('formData', JSON.stringify(formData));
				setFormDataChanged(false);
				console.log('데이터 저장');
			}
		}, 6000); // 60초

		return () => clearInterval(interval);
	}, [formDataChanged]);

	// 제출 시 전체 검증
	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};

		// 기본 정보
		if (!formData.name) newErrors.name = '공연 이름은 필수입니다.';
		if (!formData.performerName)
			newErrors.performerName = '등록 기관은 필수입니다.';
		if (!formData.summary) newErrors.summary = '줄거리를 입력해주세요.';
		if (!formData.hashtag) newErrors.hashtag = '해시태그를 입력해주세요.';
		if (!formData.roadAddress) newErrors.roadAddress = '주소를 입력해주세요.';
		if (!formData.detailAddress)
			newErrors.detailAddress = '상세 주소를 입력해주세요.';

		// 회차
		formData.rounds?.forEach(() => {
			if (
				!formData.rounds ||
				formData.rounds.length < roundCount ||
				formData.rounds.some(
					(r) =>
						!r.totalTicket ||
						!/^\d+$/.test(r.totalTicket) ||
						!r.performanceDateTime,
				)
			) {
				newErrors.rounds = '공연 일정 & 티켓 수를 모두 입력해주세요.';
			}
		});

		// 러닝타임
		if (!formData.runtime || !/^\d+$/.test(formData.runtime)) {
			newErrors.runtime = '러닝타임은 숫자로 입력해주세요.';
		}

		// 일반 예매
		const generalPrice = formData.tickets?.[0]?.price?.trim() || '';

		if (!generalPrice || !/^\d+$/.test(generalPrice)) {
			newErrors.generalPrice = '일반 예매 가격은 숫자로 입력해주세요.';
		}

		// 할인 항목 검증
		formData.tickets?.slice(1).forEach((t, idx) => {
			if (!t.discountName) {
				newErrors[`discountName-${idx}`] = '할인명을 입력해주세요.';
			}
			if (!t.price || !/^\d+$/.test(t.price)) {
				newErrors[`discountPrice-${idx}`] = '할인 가격은 숫자로 입력해주세요.';
			}
		});
		// 계좌 정보
		if (!formData.bankName) newErrors.bankName = '은행명을 입력해주세요.';
		if (!formData.account || !/^\d+$/.test(formData.account)) {
			newErrors.account = '계좌번호는 숫자만 입력 가능합니다.';
		}
		if (!formData.depositor) newErrors.depositor = '입금자명을 입력해주세요.';

		// 연락처
		if (!formData.contact) newErrors.contact = '연락처를 입력해주세요.';

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			console.log(formData);
			nextStep();
		}
	};
	return (
		<RegisterWrapper>
			<form>
				<h1>기본 정보</h1>
				<div>
					<label style={{ marginBottom: '6px' }}>포스터 썸네일</label>
					<p style={{ marginBottom: '12px' }}>한장만 등록 가능합니다.</p>
					<ImageUploadBox
						onUploadSuccess={handlePosterUpload}
						width="157px"
						height="220px"
						webWidth="228px"
						webHeight="320px"
						filePath="amateurShow"
						value={formData.posterImageUrl}
					/>
					<p>{formData.posterImageUrl}</p>
				</div>
				<div>
					<label>공연 이름</label>

					<input
						type="text"
						name="name"
						placeholder="등록할 공연의 이름을 입력하세요"
						value={formData.name}
						onChange={handleInputChange}
						className="input-text"
					/>
					{errors.name && <Err style={{ color: 'red' }}>{errors.name}</Err>}
				</div>
				<div>
					<label>등록 기관 (api에 관련 변수명x) </label>
					<input
						className="input-text"
						type="text"
						name="performerName"
						placeholder="등록하는 기관(공연진)의 이름을 입력하세요"
						value={formData.performerName}
						onChange={handleInputChange}
					/>
					{errors.performerName && (
						<Err style={{ color: 'red' }}>{errors.performerName}</Err>
					)}
				</div>
				<div>
					<label>줄거리</label>
					<textarea
						type="text"
						name="summary"
						placeholder="공연의 줄거리를 입력하세요 (1,000자 이하)"
						value={formData.summary}
						onChange={handleInputChange}
					/>
					{errors.summary && (
						<Err style={{ color: 'red' }}>{errors.summary}</Err>
					)}
				</div>
				<div>
					<label>해시태그</label>
					<input
						className="input-text"
						type="text"
						name="hashtag"
						placeholder="예) #뮤지컬 #드라마"
						value={formData.hashtag}
						onChange={handleInputChange}
					/>
					{errors.hashtag && (
						<Err style={{ color: 'red' }}>{errors.hashtag}</Err>
					)}
				</div>
				<div>
					<label>공연장 주소</label>
					<PostCodeInput
						value={formData.roadAddress}
						detailValue={formData.detailAddress}
						onChange={({ name, value }) =>
							setFormData((prev) => ({ ...prev, [name]: value }))
						}
					/>
					{errors.roadAddress && (
						<Err style={{ color: 'red' }}>{errors.roadAddress}</Err>
					)}
					{errors.detailAddress && (
						<Err style={{ color: 'red' }}>{errors.detailAddress}</Err>
					)}
				</div>

				<div>
					<label>공연 회차</label>
					<Counter count={roundCount} setCount={setRoundCount} />
				</div>
				<div>
					<label>공연 일정 & 티켓 수</label>
					{Array.from({ length: roundCount }, (_, index) => (
						<div key={index}>
							<p>{index + 1}회차</p>
							<UnitInput
								type="text"
								name={`ticketCount-${index}`}
								// value는 formData.rounds 배열에서 가져오기
								value={formData.rounds?.[index]?.totalTicket || ''}
								onChange={(e) =>
									handleRoundChange(index, 'totalTicket', e.target.value)
								}
								unit="장"
							/>
							{errors[`totalTicket-${index}`] && (
								<Err style={{ color: 'red' }}>
									{errors[`totalTicket-${index}`]}
								</Err>
							)}
							<div style={{ marginTop: '8px' }}>
								<DateInput
									type="text"
									name={`round-${index}`}
									// value는 formData.rounds 배열에서 가져오기
									value={formData.rounds?.[index]?.performanceDateTime || ''}
									onChange={(value) =>
										handleRoundChange(index, 'performanceDateTime', value)
									}
								/>
								{errors[`performanceDateTime-${index}`] && (
									<Err style={{ color: 'red' }}>
										{errors[`performanceDateTime-${index}`]}
									</Err>
								)}
							</div>
						</div>
					))}{' '}
					{errors.rounds && <Err style={{ color: 'red' }}>{errors.rounds}</Err>}
				</div>
				<div>
					<label>러닝타임</label>
					<UnitInput
						type="text"
						name="runtime"
						value={formData.runtime}
						onChange={handleInputChange}
						placeholder="공연이 진행되는 시간을 입력해주세요 (분 단위)"
						unit="분"
					/>
					{errors.runtime && (
						<Err style={{ color: 'red' }}>{errors.runtime}</Err>
					)}
				</div>
				<div>
					<label>일반 예매</label>
					<UnitInput
						type="text"
						name="tickets.0.price" // ✅ 고정
						value={formData.tickets?.[0]?.price || ''}
						onChange={handleInputChange}
						placeholder="가격을 입력해주세요"
						unit="원"
					/>
					{errors.generalPrice && (
						<Err style={{ color: 'red' }}>{errors.generalPrice}</Err>
					)}
				</div>
				<div>
					<label>할인</label>
					<InputRow>
						<p>할인명</p>
						<p>가격</p>
					</InputRow>
					{formData.tickets?.slice(1).map((ticket, idx) => {
						const realIndex = idx + 1; // 실제 tickets 배열 인덱스
						return (
							<InputRow key={realIndex}>
								<input
									className="input-text"
									type="text"
									placeholder="할인명을 입력해주세요"
									name={`tickets.${realIndex}.discountName`}
									value={ticket.discountName}
									onChange={handleInputChange}
								/>
								<UnitInput
									placeholder="가격을 입력해주세요"
									unit="원"
									name={`tickets.${realIndex}.price`}
									value={ticket.price}
									onChange={handleInputChange}
								/>
								<button
									type="button"
									onClick={() => handleRemoveTicket(realIndex)}
								>
									X
								</button>
							</InputRow>
						);
					})}

					<button
						type="button"
						className="btn-add"
						onClick={handleAddTicket}
						style={{ marginTop: '12px' }}
					>
						+ 추가하기
					</button>
					{errors.discounts && (
						<Err style={{ color: 'red' }}>{errors.discounts}</Err>
					)}
				</div>

				<div>
					<label>계좌번호</label>

					<input
						className="input-text"
						type="text"
						placeholder="은행명을 입력해주세요"
						name="bankName" // key 경로
						value={formData.bankName}
						onChange={handleInputChange}
					/>
					{errors.bankName && (
						<Err style={{ color: 'red' }}>{errors.bankName}</Err>
					)}

					<input
						className="input-text"
						type="text"
						placeholder="(-) 제외한 계좌번호를 입력해주세요"
						name="account" // key 경로
						value={formData.account}
						onChange={handleInputChange}
					/>
					{errors.account && (
						<Err style={{ color: 'red' }}>{errors.account}</Err>
					)}

					<input
						className="input-text"
						type="text"
						placeholder="입금자명을 써주세요"
						name="depositor"
						value={formData.depositor}
						onChange={handleInputChange}
					/>
					{errors.depositor && (
						<Err style={{ color: 'red' }}>{errors.depositor}</Err>
					)}
				</div>
				<div>
					<label>연락처</label>
					<input
						className="input-text"
						type="text"
						placeholder="문의에 쓰일 SNS나 연락처를 입력해주세요"
						name="contact"
						value={formData.contact}
						onChange={handleInputChange}
					/>
					{errors.contact && (
						<Err style={{ color: 'red' }}>{errors.contact}</Err>
					)}
				</div>
			</form>
			<button
				style={{ marginTop: '44px' }}
				type="button"
				className="btn-primary"
				onClick={handleSubmit}
			>
				다음
			</button>
			{/*<ButtonWrapper>
				<button
					style={{ marginTop: '44px', minWidth: '140px' }}
					type="submit"
					className="btn-primary"
					onClick={() => handleNextStep()}
				>
					다음
				</button>
				<button
					className="save"
					type="button"
					onClick={() =>
						localStorage.setItem('formData', JSON.stringify(formData))
					}
				>
					저장하기
				</button>
				<button
					className="save"
					type="button"
					onClick={() => {
						const saved = localStorage.getItem('formData');
						if (saved) {
							setFormData(JSON.parse(saved));
						} else {
							alert('저장된 데이터가 없습니다.');
						}
					}}
				>
					불러오기
				</button>
			</ButtonWrapper> */}
		</RegisterWrapper>
	);
}

export default RegisterStep1;

const InputRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 0.1fr;
	gap: 12px;
`;
const Err = styled.p``;
