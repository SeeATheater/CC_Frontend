//yarn add react-select
import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import useAxios from '@/utils/hooks/useAxios';
import { getPresignedUrl } from '@/utils/apis/getPresignedUrl';
import { uploadImageToS3 } from '@/utils/apis/uploadImageToS3';
import useCustomFetch from '@/utils/hooks/useCustomFetch';

import ImageUploadBox from '@/components/ImageUploadBox2';
import TopBar from '@/components/TopBar';
import Modal from '@/components/Production/Modal';
import CalendarPeriod from '@/components/CalendarPeriod';

import ChevronDown from '@/assets/icons/chevronDown.svg?react';

function UploadPic() {
	const navigate = useNavigate();

	const [files, setFiles] = useState([]);
	const [selected, setSelected] = useState(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);
	const [customOptions, setCustomOptions] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [textContent, setTextContent] = useState('');

	const isFormValid = Boolean(
		selected?.title &&
			selected?.date &&
			selected?.value &&
			files.length > 0 &&
			textContent.trim().length > 0,
	);
	const searchInput = encodeURIComponent(inputValue);
	const {
		data: searchData,
		error: searchError,
		loading: searchLoading,
	} = useCustomFetch(`/search?keyword=${searchInput}&page=0&size=10`);

	console.log('선택됨', selected);
	console.log('files:', files);
	console.log('files.length:', files.length);
	console.log('isFormValid:', isFormValid);

	const searchOptions = (searchData?.result?.content || []).map((item) => ({
		value: item.showId,
		title: item.title,
		date: item.schedule,
		label: (
			<LabelWrapper>
				{item.posterImageUrl && (
					<img
						src={item.posterImageUrl}
						alt={item.title}
						style={{ width: 30, height: 40, marginRight: 8, borderRadius: 4 }}
					/>
				)}
				<div>
					<Title>{item.title}</Title>
					<Date>{item.schedule}</Date>
				</div>
			</LabelWrapper>
		),
	}));

	const options = [
		...searchOptions,
		{
			value: 'custom',
			label: <Title>직접 입력</Title>,
		},
	];

	const handleSelectChange = (option) => {
		if (option.value === 'custom') {
			setShowModal(true);
			setMenuOpen(false);
			return;
		}
		setSelected(option);
	};

	const handleModalSubmit = (title, range) => {
		const [start, end] = range;
		const formattedRange = `${start.toLocaleDateString()} ~ ${end.toLocaleDateString()}`;
		const newOption = {
			value: Date.now(),
			title,
			date: formattedRange,
			label: (
				<LabelWrapper>
					<Title>{title}</Title>
					<Date>{formattedRange}</Date>
				</LabelWrapper>
			),
		};
		setCustomOptions((prev) => [...prev, newOption]);
		setSelected(newOption);
		setShowModal(false);
	};

	const handleCalendarSubmit = (range) => {
		if (!inputValue || !range || !range[0] || !range[1]) return;

		const [start, end] = range;
		const formattedRange = `${start.toLocaleDateString()} ~ ${end.toLocaleDateString()}`;

		const newOption = {
			value: `${inputValue}-${formattedRange}`,
			title: inputValue,
			date: formattedRange,
			label: (
				<LabelWrapper>
					<Title>{inputValue}</Title>
					<Date>{formattedRange}</Date>
				</LabelWrapper>
			),
		};

		setCustomOptions((prev) => [...prev, newOption]);
		setSelected(newOption);
		setShowCalendar(false);
		setInputValue('');
	};

	const handleFileChange = (selectedFiles) => {
		setFiles(selectedFiles);
	};
	const axiosClient = useAxios();
	const { fetchData } = useCustomFetch(null, 'POST', null);

	//console.log('선택', selected.value);

	const getProdId = async (amateurShowId) => {
		const res = await axiosClient.get(`/amateurs/${amateurShowId}`);
		return res.data.result.memberId;
	};

	const handleUpload = async () => {
		if (!isFormValid) {
			alert('모든 필수 정보를 입력해 주세요.');
			return;
		}

		try {
			const extensions = files.map((file) =>
				file.name.split('.').pop().toLowerCase(),
			);

			const presignedList = await getPresignedUrl(
				axiosClient,
				extensions,
				'photoAlbum',
			);

			await Promise.all(
				presignedList.map((item, idx) =>
					uploadImageToS3(files[idx], item.uploadUrl),
				),
			);

			const postBody = {
				amateurShowId: selected.value,
				content: textContent,
				imageRequestDTOs: presignedList.map((item) => ({
					keyName: item.keyName,
				})),
			};

			const res = await fetchData('/photoAlbums', 'POST', postBody);

			const albumId = res?.data?.result?.photoAlbumId;
			if (!albumId) {
				throw new Error('photoAlbumId가 없습니다.');
			}
			const prodId = await getProdId(selected.value);

			navigate('/production/uploadDone', {
				state: {
					albumId,
					prodId,
				},
			});
		} catch (err) {
			console.error(err);
			alert('업로드 실패: ' + err.message);
		}
	};

	return (
		<>
			<Mobile>
				{menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}
				<TopBar> 사진첩 게시 </TopBar>
				<Content>
					<StyledSelect
						options={options}
						value={selected}
						onChange={handleSelectChange}
						placeholder="공연을 선택해주세요"
						isSearchable={false}
						components={{ IndicatorSeparator: () => null }}
						onMenuOpen={() => setMenuOpen(true)}
						onMenuClose={() => setMenuOpen(false)}
					/>
					<ImageUploadBox
						size="362px"
						aspect-ratio="1"
						onFileSelect={handleFileChange}
					/>
					<textarea
						className="add"
						placeholder="공연에서 있었던 이야기를 작성해 주세요"
						rows="10"
						value={textContent}
						onChange={(e) => setTextContent(e.target.value)}
					/>
				</Content>
				{showModal && (
					<Modal
						onClose={() => setShowModal(false)}
						onSubmit={handleModalSubmit}
					/>
				)}
			</Mobile>

			<Web>
				<Container>
					<Content>
						<UpperArea>
							{selected ? (
								<SelectedInfo>
									<SelectedInfoWrapper>
										<Title>{selected.title}</Title>
										<ChevronDownGray
											onClick={() => {
												setSelected(null);
												setInputValue('');
											}}
										/>
									</SelectedInfoWrapper>
									<Date>{selected.date}</Date>
								</SelectedInfo>
							) : (
								<SearchWrapper>
									<input
										type="text"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										onFocus={() => setMenuOpen(true)}
										placeholder="공연을 입력하세요"
									/>
									{menuOpen && (
										<Dropdown>
											{options.map((option, idx) => (
												<OptionItem
													key={idx}
													onClick={() => {
														setSelected(option);
														setMenuOpen(false);
														setInputValue('');
													}}
												>
													<LabelWrapper>
														<Title>{option.title}</Title>
														<Date>{option.date}</Date>
													</LabelWrapper>
												</OptionItem>
											))}
											<OptionItem
												isNew
												onClick={() => {
													setShowCalendar(true);
													setMenuOpen(false);
												}}
											>
												+ 새로 공연 추가하기
											</OptionItem>
										</Dropdown>
									)}
								</SearchWrapper>
							)}
							<UploadBtn onClick={handleUpload} disabled={!isFormValid}>
								등록
							</UploadBtn>
						</UpperArea>

						<ImageUploadBox
							size="362px"
							aspect-ratio="1"
							onFileSelect={handleFileChange}
						/>
						<textarea
							className="add"
							placeholder="공연에서 있었던 이야기를 작성해 주세요"
							rows="10"
							value={textContent}
							onChange={(e) => setTextContent(e.target.value)}
						/>
					</Content>

					{showCalendar && (
						<CalendarWrapper>
							<CalendarPeriod onChange={handleCalendarSubmit} />
						</CalendarWrapper>
					)}
				</Container>
			</Web>
		</>
	);
}

export default UploadPic;
const ChevronDownGray = styled(ChevronDown)`
	color: ${({ theme }) => theme.colors.gray400};
`;
const Mobile = styled.div`
	width: 100vw;
	height: 100vh;

	@media (min-width: 768px) {
		display: none;
	}
`;
const Web = styled.div`
	display: none;
	@media (min-width: 768px) {
		width: 100vw;
		display: flex;
		padding: 100px 100px 100px 160px;
	}
`;
const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1;
`;
const Content = styled.div`
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;

	.add {
		border: none;
		font-size: ${({ theme }) => theme.font.fontSize.body13};
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
		color: ${({ theme }) => theme.colors.grayMain};
	}

	textarea::placeholder {
		color: ${({ theme }) => theme.colors.gray400};
	}
	textarea:focus {
		outline: none;
	}

	@media (min-width: 768px) {
		.add {
			font-size: ${({ theme }) => theme.font.fontSize.title16};
			font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		}
	}
`;
const LabelWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Title = styled.div`
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.grayMain};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.headline20};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;

const Date = styled.div`
	font-size: ${({ theme }) => theme.font.fontSize.body10};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.gray400};

	@media (min-width: 768px) {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.normal};
		color: ${({ theme }) => theme.colors.gray400};
	}
`;

const StyledSelect = styled(Select).attrs({
	classNamePrefix: 'custom',
})`
	width: 60%;

	.custom__control {
		border-radius: 3px;
		border: none;
		padding: 8px 4px;
		box-shadow: none;
		background-color: white;
	}

	.custom__menu {
		border-radius: 3px;
		z-index: 100;
	}

	.custom__option {
		cursor: pointer;
		padding: 8px 4px;
		background-color: white;

		&:hover {
			background-color: #f9f9f9;
		}

		&--is-selected {
			background-color: #f4e5f7;
		}
	}
	.custom__placeholder {
		color: ${({ theme }) => theme.colors.gray400};
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
	}
`;
const UpperArea = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0 14px 0;
	border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

const UploadBtn = styled.button`
	width: 80px;
	padding: 8px 14px;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	background-color: ${({ disabled, theme }) =>
		disabled ? theme.colors.gray300 : theme.colors.pink500};
	color: ${({ theme }) => theme.colors.grayWhite};
	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const SearchWrapper = styled.div`
	position: relative;
	width: 100%;

	input {
		font-size: ${({ theme }) => theme.font.fontSize.headline24};
		font-weight: ${({ theme }) => theme.font.fontWeight.extraBold};
		color: ${({ theme }) => theme.colors.grayMain};

		width: 300px;
		padding: 10px;
		border: none;
		border-radius: 5px;
	}
	input::placeholder {
		color: ${({ theme }) => theme.colors.gray400};
	}
	input:focus {
		outline: none;
	}
`;

const Dropdown = styled.ul`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background-color: white;
	border: 1px solid #ccc;
	border-top: none;
	z-index: 10;
	max-height: 200px;
	overflow-y: auto;

	width: 300px;
`;

const OptionItem = styled.li`
	padding: 10px;
	cursor: pointer;
	//background-color: ${({ isNew }) => (isNew ? '#f5f5f5' : 'white')};

	&:hover {
		background-color: #eee;
	}

	font-size: ${({ theme }) => theme.font.fontSize.headline20};
	font-weight: ${({ theme }) => theme.font.fontWeight.normal};
	color: ${({ theme }) => theme.colors.gray400};
`;
const CalendarWrapper = styled.div`
	position: absolute;
	top: 170px;
	z-index: 9;
	background: white;
	border: 1px solid #ccc;
	padding: 16px;
	border-radius: 6px;
`;

const SelectedInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 300px;
	padding: 10px;
	border-radius: 5px;
`;
const SelectedInfoWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ChangeBtn = styled.button`
	background: none;
	border: none;
	color: ${({ theme }) => theme.colors.gray500};
	font-size: ${({ theme }) => theme.font.fontSize.body12};
	cursor: pointer;
`;
