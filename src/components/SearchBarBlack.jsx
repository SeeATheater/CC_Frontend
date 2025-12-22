import styled from 'styled-components';
import Search from '@/assets/icons/SearchBlack.svg?react';
import { useState } from 'react';
function SearchBarBlack({ onSearch }) {
	const [keyword, setKeyword] = useState('');

	const handleChange = (e) => {
		const value = e.target.value;
		setKeyword(value);

		// 🔥 부모에게 전달 (API 다시 호출하게 됨)
		onSearch && onSearch(value);
	};

	return (
		<Wrapper>
			<Bar
				value={keyword}
				onChange={handleChange}
				placeholder="검색 키워드, 공연 명으로 검색 가능합니다"
			/>
			<IconWrapper>
				<Search height={24} />
			</IconWrapper>
		</Wrapper>
	);
}

export default SearchBarBlack;

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const IconWrapper = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
`;

const Bar = styled.input`
	width: 100%;
	height: 32px;
	flex-shrink: 0;
	border-radius: 7px;
	border: 1px solid #000;
	padding-left: 10px;
`;
