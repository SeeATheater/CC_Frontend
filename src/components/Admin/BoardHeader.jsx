import styled from 'styled-components';
import SearchIcon from '@/assets/icons/searchBlack.svg?react';

function BoardHeader({ title, searchTerm, setSearchTerm, buttonName,onButtonClick, buttonDisabled }) {

	return (
		<>
			<Title>{title}</Title>
			<FilterArea>
				<SearchInput>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<SearchIcon width={15} />
				</SearchInput>
				<TaskButton disabled={buttonDisabled} onClick={onButtonClick}>{buttonName}</TaskButton>
			</FilterArea>
		</>
	);
}

export default BoardHeader;

const Title = styled.h3`
	font-size: ${({ theme }) => theme.font.fontSize.headline24};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};
	color: ${({ theme }) => theme.colors.pink600};
	margin-bottom: 15px;
`;

const FilterArea = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 36px;
`;

const SearchInput = styled.div`
	display: flex;
	align-items: center;
	padding: 0 10px;
	background: #fff;
	width: 360px;
	height: 32px;
	border-radius: 7px;
	border: 1px solid #000;

	input {
		width: 100%;
		border: none;
		outline: none;
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.grayMain};
	}
`;

const TaskButton = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: #FFFFFF;
	border-radius: 3px;
	background-color: #F67676;
	min-width: 92px;
	height: 34px;
	padding: 8px 20px;
	cursor: pointer;
	text-align: center;
`;
