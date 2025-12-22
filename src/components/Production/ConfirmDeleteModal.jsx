import styled from 'styled-components';

function ConfirmDeleteModal({
	isOpen,
	title = '삭제하시겠습니까?',
	commet = '삭제된 사진첩은 복구할 수 없습니다.',
	onCancel,
	onConfirm,
}) {
	if (!isOpen) return null;

	return (
		<Overlay>
			<Modal>
				<p className="title">{title}</p>
				<p className="comment">{commet}</p>

				<ButtonGroup>
					<Button className="back" onClick={onCancel}>
						이전으로
					</Button>
					<Button className="delete" onClick={onConfirm}>
						삭제하기
					</Button>
				</ButtonGroup>
			</Modal>
		</Overlay>
	);
}

export default ConfirmDeleteModal;

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);

	display: flex;
	align-items: center;
	justify-content: center;

	z-index: 1000;
`;

const Modal = styled.div`
	width: 500px;
	background: #fff;
	border-radius: 5px;
	padding: 40px;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 24px;

	.title {
		font-size: ${({ theme }) => theme.font.fontSize.title16};
		font-weight: ${({ theme }) => theme.font.fontWeight.bold};
		color: ${({ theme }) => theme.colors.blackMain};
	}
	.comment {
		font-size: ${({ theme }) => theme.font.fontSize.body14};
		font-weight: ${({ theme }) => theme.font.fontWeight.regular};
		color: ${({ theme }) => theme.colors.gray400};
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 40px;
`;

const Button = styled.button`
	width: 153px;
	height: 40px;
	border-radius: 3px;
	cursor: pointer;

	font-size: ${({ theme }) => theme.font.fontSize.body14};
	font-weight: ${({ theme }) => theme.font.fontWeight.bold};

	&.back {
		border: 1px solid ${({ theme }) => theme.colors.gray300};
		color: ${({ theme }) => theme.colors.blackMain};
	}

	&.delete {
		border: none;
		color: ${({ theme }) => theme.colors.grayWhite};
		background-color: ${({ theme }) => theme.colors.pink600};
	}
`;
