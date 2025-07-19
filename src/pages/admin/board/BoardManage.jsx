import { useMemo, useState } from 'react';
import styled from 'styled-components';

import BoardHeader from '@/components/Admin/BoardHeader';
import UserTable from '@/components/Admin/UserTable';
import SampleImg from '../../../assets/mock/images/image1.png'

export const mockPosts = [
        {
            id: '아이디',
            title: '제목',
            content: '내용',
            author: '작성자',
            date: '날짜',
            likes: '좋아요',
            comments: '댓글',
            category: '게시판 탭',
            isHot: '핫',
            image: '첨부 이미지',
            userId: '유저 아이디',
            manage: '관리'
        },
		{
            id: 1,
            title: '홍익극연구회 <실종>',
            content: '저희 홍익극연구회에서 새로운 연극 <실종>을 3일간 공연합니다! 관심 있으신 분들의 많은 참여 부탁드립니다.\n\n공연 일정:\n- 날짜: 2025년 4월 22일 ~ 24일\n- 시간: 오후 7시 30분\n- 장소: 홍익대학교 대학로 캠퍼스 아트센터\n\n티켓 예매는 홍익대학교 연극동아리 공식 인스타그램에서 가능합니다.',
            author: '익명',
            date: '2025.04.20',
            likes: 36,
            comments: 3,
            category: 'promotion',
            isHot: true,
            image: [SampleImg, SampleImg, SampleImg],
            userId: 'user1',
            manage: '/admin/board/'
        },
        {
            id: 2,
            title: '솔직 후기',
            content: '방금 보고왔는데 생각보다 재밌었음...',
            author: 'Seethe',
            date: '2025.04.20',
            likes: 17,
            comments: 3,
            category: 'general',
            isHot: true,
            image: SampleImg,
            userId: 'user2',
            manage: '/admin/board/',
        },
        {
            id: 3,
            title: '익게로 놀러와',
            content: '알라딘 후기 좀 알려봐. 어떤거 같어?\n\n최근에 다녀온 사람들 후기 공유해주세요! 볼만한지 궁금합니다.',
            author: '익명',
            date: '2025.04.20',
            likes: 6,
            comments: 3,
            category: 'general',
            isHot: false,
            image: [],
            userId: 'user3',
            manage: '/admin/board/',
        },
        {
            id: 4,
            title: '블루스퀘이',
            content: '블루스퀘이 어제 1층 F구역 10열에 앉았는데 진짜 시야 너무 좋고 짱구는 못말려 봉미선도 못말려',
            author: '익명',
            date: '2025.04.20',
            likes: 11,
            comments: 3,
            category: 'general',
            isHot: true,
            image: [],
            userId: 'user4',
            manage: '/admin/board/',
        },
	];
export const mockComments = {
    1: [
        {
        id: 1,
        author: '익명',
        content: '와 기대된다!',
        date: '04.22',
        userId: 'user11',
        replyLevel: 0,
        parentId: null,
        likes: 8
        },
        {
        id: 2,
        author: '카모이',
        content: '꼭 보러 갈게요',
        date: '04.22',
        userId: 'user12',
        replyLevel: 0,
        parentId: null,
        likes: 1
        },
        {
        id: 3,
        author: '기돼',
        content: '티켓 예매 어떻게 하나요?',
        date: '04.22',
        userId: 'user13',
        replyLevel: 0,
        parentId: null,
        likes: 3
        }
    ],
    2: [
        {
        id: 4,
        author: '익명',
        content: '추천!',
        date: '04.22',
        userId: 'user14',
        replyLevel: 0,
        parentId: null,
        likes: 10
        },
        {
        id: 5,
        author: '익명',
        content: '난 별로',
        date: '04.22',
        userId: 'user15',
        replyLevel: 0,
        parentId: null,
        likes: 8
        },
        {
        id: 6,
        author: '익명',
        content: '생각보다 별로인 사람들이 많네,,, 기대 이하였나?',
        date: '04.22',
        userId: 'user2',
        replyLevel: 1,
        parentId: 5,
        likes: 0
        },
        {
        id: 7,
        author: '익명',
        content: '사람마다 취향은 다르니까..! 난 개인적으로 그닥...이었어',
        date: '04.22',
        userId: 'user17',
        replyLevel: 1,
        parentId: 5,
        likes: 0
        },
        {
        id: 8,
        author: '익명',
        content: '홀리 씻',
        date: '04.22',
        userId: 'user17',
        replyLevel: 2,
        parentId: 6,
        likes: 0
        },
    ],
    4: [
        {
        id: 9,
        author: '익명',
        content: '저도 거기 갔었는데 정말 좋더라구요',
        date: '04.22',
        userId: 'user15',
        replyLevel: 0,
        parentId: null,
        likes: 11
        },
        {
        id: 10,
        author: '익명',
        content: '다음에 또 가고 싶어요',
        date: '04.22',
        userId: 'user16',
        replyLevel: 0,
        parentId: null,
        likes: 1
        },
        {
        id: 11,
        author: '익명',
        content: 'ㅋㅋㅋ',
        date: '04.22',
        userId: 'user17',
        replyLevel: 0,
        parentId: null,
        likes: 0
        }
    ]
    };

function BoardManage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [visibleColumns, setVisibleColumns] = useState([
		'id',
		'date',
		'manage'
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	const filteredData = useMemo(() => {
		const content = mockPosts.slice(1);
		return content.filter((user) =>
			Object.entries(user).some(
				([key, val]) =>
					visibleColumns.includes(key) &&
					String(val).toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}, [searchTerm, visibleColumns, mockPosts]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(start, start + itemsPerPage);
	}, [filteredData, currentPage]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	return (
		<Container>
			<Content>
				<TableArea>
					<BoardHeader
						title="게시판 관리"
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
                        buttonName="추가하기"
					/>

					<UserTable
						data={[mockPosts[0], ...paginatedData]}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						visibleColumns={visibleColumns}
					/>
				</TableArea>
			</Content>
		</Container>
	);
}

export default BoardManage;

const Container = styled.div`
	width: 100vw;

	display: flex;
	flex-direction: column;
`;
const Content = styled.div`
	width: 100%;
	display: flex;
`;
const TableArea = styled.div`
	padding: 0px 120px 50px 50px;
	width: 100%;
`;