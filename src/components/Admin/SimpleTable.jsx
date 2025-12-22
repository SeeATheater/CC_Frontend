import React from 'react';
import styled from 'styled-components';

const SimpleTable = ({ data }) => {
	if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;

	const headers = Object.keys(data[0]).filter((key) => key !== 'id');
	const rows = data.slice(1);

	console.log((data))

	return (
		<Table>
			<thead>
				<tr>
					{headers.map((key) => (
						<Th key={key}>{data[0][key]}</Th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((item) => (
					<tr key={item.id}>
						{headers.map((key) => (
							<Td key={key}>{item[key]}</Td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default SimpleTable;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin-top: 20px;
`;

const Th = styled.th`
	padding: 14px;
	font-weight: bold;
	border: 1px solid #ccc;
	text-align: center;
`;

const Td = styled.td`
	padding: 14px;
	border: 1px solid #ccc;
	text-align: center;
`;
