import styled from 'styled-components';
import SearchBoxBlack from '@/assets/icons/SearchBoxBlack.svg?react';
import SearchBarBlack from '@/components/SearchBarBlack.jsx';
function SearchOptionBar() {
	return (
		<>
			<SearchOptionArea>
				<div style={{ width: '360px' }}>
					<SearchBarBlack />
				</div>
				<div>
					<label>
						<input type="checkbox" />
						아이디
					</label>
					<label>
						<input type="checkbox" />
						이름
					</label>
					<label>
						<input type="checkbox" />
						E-mail
					</label>
					<label>
						<input type="checkbox" />
						번호
					</label>
					<label>
						<input type="checkbox" />
						연극명
					</label>
					<SearchBoxBlack />
				</div>
			</SearchOptionArea>
		</>
	);
}
export default SearchOptionBar;
const SearchOptionArea = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 36px;
	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12px;
		& > label {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 4px;
			font-size: 14px;

			input {
				width: 19px;
				height: 19px;
				flex-shrink: 0;
				border: 1px solid #000;
				background: black;
			}
		}
	}
`;
