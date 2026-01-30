import { useState, useEffect, useCallback, useRef } from 'react';
import useResponsive from '@/pages/board/hooks/useResponsive';
import useCustomFetch from '@/utils/hooks/useCustomFetch';
import * as boardApi from '@/pages/board/api/boardApi.js';
import * as imageApi from '@/pages/board/api/imageApi.js';
import * as authApi from '@/pages/board/api/authApi.js';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(() => {
    const savedRole = sessionStorage.getItem('selectedRole');
    if (savedRole === 'PERFORMER') return 'performer';
    if (savedRole === 'AUDIENCE') return 'audience';
    return 'normalUser';
  });
  const isPC = useResponsive();
  
  // useCustomFetch 훅 사용
  const { fetchData } = useCustomFetch();
  
  // fetchData가 매번 새로 생성되는 것을 방지
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  // 현재 사용자 정보 로드
  const loadCurrentUser = useCallback(async () => {
    try {
      const userInfo = await authApi.getCurrentUser(fetchDataRef.current);
      
      // Api응답구조 처리 (result 안에 실제 데이터가 있는 경우)
      let actualUserData = userInfo;
      if (userInfo?.isSuccess && userInfo?.result) {
        actualUserData = userInfo.result;
      }
      
      if (actualUserData) {
        setCurrentUser(actualUserData);
        
        // sessionStorage에서 role 가져오기 (로그인 시 저장된 값)
        const savedRole = sessionStorage.getItem('selectedRole');
        // console.log('Role from sessionStorage:', savedRole);
        
        if (savedRole === 'PERFORMER') {
          setUserType('performer'); // 공연 등록자 (홍보 게시판 작성 가능)
        } else if (savedRole === 'AUDIENCE') {
          setUserType('audience'); // 예매자 (일반 게시판만 작성 가능)
        } else if (actualUserData.id || actualUserData.memberId) {
          // 혹시 role 정보가 없지만 로그인은 된 경우 (기본: 예매자)
          setUserType('audience');
        }
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      // 로그인하지 않은 경우
      setUserType('normalUser');
    }
  }, []); 

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // API 응답 데이터 변환
  const transformBoardData = useCallback((apiBoard) => {
    // 이미지 처리: imgUrls (배열) 우선, 없으면 imgUrl (단일)을 배열로 변환
    let imageArray = [];
    if (apiBoard.imgUrls && Array.isArray(apiBoard.imgUrls)) {
      imageArray = apiBoard.imgUrls;
    } else if (apiBoard.imgUrl) {
      imageArray = [apiBoard.imgUrl];
    }

    return {
      id: apiBoard.boardId,
      title: apiBoard.title,
      content: apiBoard.content,
      author: apiBoard.writer,
      date: new Date(apiBoard.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.').replace('.', '.'),
      likes: apiBoard.likeCount,
      comments: apiBoard.commentCount,
      category: apiBoard.boardType.toLowerCase() === 'normal' ? 'general' : 'promotion',
      isHot: apiBoard.likeCount >= 10,
      image: imageArray,
      userId: apiBoard.memberId,
      createdAt: apiBoard.createdAt,
      updatedAt: apiBoard.updatedAt,
      isLiked: apiBoard.liked || false
    };
  }, []);

  const cleanContent = (text) => {
    if (typeof text !== "string") return text;
    // 문자열 앞뒤에 큰따옴표가 있을 때 제거 (Update 응답이 큰따옴표로 감싸져서 옴)
    return text.replace(/^"(.*)"$/, "$1");
  };
  // 댓글 데이터 변환
  const transformCommentData = useCallback((apiComment, boardId, depth = 0) => {
    const rawContent = apiComment.deleted ? "삭제된 댓글입니다." : apiComment.content;
    const fixedContent = cleanContent(rawContent);  // // "" 제거 content 
    const transformed = {
      id: apiComment.commentId,
      boardId: boardId,
      author: apiComment.writer,
      content: fixedContent,   
      date: new Date(apiComment.createdAt).toLocaleDateString('ko-KR', { 
        month: '2-digit', 
        day: '2-digit' 
      }).replace(/\. /g, '.').replace('.', '.'),
      userId: apiComment.memberId,
      replyLevel: depth,
      parentId: apiComment.parentId,
      likes: apiComment.likeCount || 0,
      isLiked: apiComment.liked || false,
      isDeleted: apiComment.deleted || false,
      children: []
    };

    if (apiComment.children && apiComment.children.length > 0) {
      transformed.children = apiComment.children.map(child => 
        transformCommentData(child, boardId, depth + 1)
      );
    }

    return transformed;
  }, []);

  // 댓글을 평면 배열로 변환
  const flattenComments = useCallback((comments, boardId) => {
    const result = [];
    
    const flatten = (commentList, level = 0) => {
      commentList.forEach(comment => {
        result.push({ ...comment, replyLevel: level });
        if (comment.children && comment.children.length > 0) {
          flatten(comment.children, level + 1);
        }
      });
    };
    
    flatten(comments);
    return result;
  }, []);

  // 글작성 권한확인 (sessionStorage 기반)
  const canCreatePost = useCallback((category) => {
    // console.log('Checking post creation permission:', { category, userType });
    
    // 일반 게시판: 로그인한 모든 사용자 작성 가능
    if (category === 'general' || category === 'hot') {
      return userType !== 'normalUser'; // 로그인만 되어 있으면 OK
    }
    
    // 홍보 게시판: PERFORMER만 작성 가능
    if (category === 'promotion') {
      return userType === 'performer';
    }
    
    return false;
  }, [userType]);

  // 게시글 목록 로드
const loadPosts = useCallback(async (category = 'general', pageNum = 0, reset = false) => {
  if (loading) return;
  
  setLoading(true);
  try {
    const pageSize = isPC ? 6 : 20;
    let incomingPosts = [];

    if (category === 'hot') {
      const res = await boardApi.getHotBoards(fetchDataRef.current);
      // useCustomFetch가 axios response를 반환하므로 .data 추출 후 result 접근
      const responseData = res.data || res;
      const hotBoardsData = responseData.isSuccess ? responseData.result : responseData;
      
      // HOT 게시판 content 배열 처리 (배열 직접 반환 or content 속성)
      const hotContent = Array.isArray(hotBoardsData) ? hotBoardsData : hotBoardsData.content;
      incomingPosts = hotContent.map(transformBoardData);
      setHasMore(hotBoardsData.hasNext || false);
    } else {
      const res = await boardApi.getBoardList(fetchDataRef.current, category, pageNum, pageSize);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const responseData = res.data || res;
      const boardData = responseData.isSuccess ? responseData.result : responseData;
      
      incomingPosts = boardData.content.map(transformBoardData);

      setHasMore(boardData.hasNext || false);
    }

    if (reset) {
      setPosts(incomingPosts);
    } else {
      setPosts(prev => {
        const merged = [...prev, ...incomingPosts];
        return merged.filter((post, idx, self) => idx === self.findIndex(p => p.id === post.id));
      });
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error);
  } finally {
    setLoading(false);
  }
}, [isPC, transformBoardData, loading]);

  // 더보기 
  const loadMore = useCallback((category) => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(category, nextPage, false);
    }
  }, [loading, hasMore, page, loadPosts]);

  // 게시글 상세 조회
  const getPost = useCallback(async (id) => {
    try {
      const response = await boardApi.getBoardDetail(fetchDataRef.current, id);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const postData = response.data || (response.isSuccess ? response.result : response);
      return transformBoardData(postData);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      return null;
    }
  }, [transformBoardData]);

  // 댓글 목록 조회
  const getComments = useCallback(async (postId) => {
    try {
      const response = await boardApi.getComments(fetchDataRef.current, postId);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const commentsData = response.data || (response.isSuccess ? response.result : response);
      const transformedComments = commentsData.map(comment => transformCommentData(comment, postId));
      return flattenComments(transformedComments, postId);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      return [];
    }
  }, [transformCommentData, flattenComments]);

  // 게시글 작성
  const addPost = useCallback(async (postData) => {
    try {
      console.log('게시글 작성 시작:', postData);
      
      let imageRequestDTOs = [];
      
      if (postData.images && postData.images.length > 0) {
        console.log('이미지 처리 시작, 파일 수:', postData.images.length);
        
        const files = postData.images
          .filter(img => img.file instanceof File)
          .map(img => img.file);
        
        if (files.length > 0) {
          imageRequestDTOs = await imageApi.processImagesForCreate(fetchDataRef.current, files);
          console.log('이미지 처리 완료:', imageRequestDTOs);
        }
      }

      const boardData = {
        title: postData.title,
        content: postData.content,
        boardType: boardApi.BOARD_TYPE[postData.category] || 'NORMAL',
        imageRequestDTOs
      };

      console.log('게시글 API 호출:', boardData);
      const response = await boardApi.createBoard(fetchDataRef.current, boardData);
      console.log('게시글 작성 완료:', response);
      
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const createdPostData = response.data || (response.isSuccess ? response.result : response);
      return transformBoardData(createdPostData);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  }, [transformBoardData]);

  // 게시글 수정
  const updatePost = useCallback(async (postId, updates) => {
    try {
      console.log('게시글 수정 시작:', { postId, updates });
      
      // 기존 이미지: file이 없고 url과 keyName이 있는 것들
      const existingImages = updates.images?.filter(img => !img.file && (img.url || img.keyName)) || [];
      // 새 파일: file이 있는 것들
      const newFiles = updates.images?.filter(img => img.file instanceof File).map(img => img.file) || [];
      
      console.log('기존 이미지:', existingImages.length, '새 파일:', newFiles.length);
      
      // processImagesForUpdate는 { keyName } 형식만 반환
      const imageRequestDTOs = await imageApi.processImagesForUpdate(fetchDataRef.current, existingImages, newFiles);
      console.log('수정용 이미지 처리 완료:', imageRequestDTOs);
      
      const boardData = {
        title: updates.title,
        content: updates.content,
        boardType: boardApi.BOARD_TYPE[updates.category] || 'NORMAL',
        imageRequestDTOs
      };
      
      console.log('게시글 수정 API 호출:', boardData);
      const response = await boardApi.updateBoard(fetchDataRef.current, postId, boardData);
      console.log('게시글 수정 완료:', response);
      
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const updatedPostData = response.data || (response.isSuccess ? response.result : response);
      return transformBoardData(updatedPostData);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  }, [transformBoardData]);

  // 게시글 삭제
  const deletePost = useCallback(async (postId) => {
    try {
      await boardApi.deleteBoard(fetchDataRef.current, postId);
      return { success: true };
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  }, []);

  // 게시글 좋아요 토글
  const togglePostLike = useCallback(async (postId) => {
    try {
      await boardApi.toggleBoardLike(fetchDataRef.current, postId);
      return { success: true };
    } catch (error) {
      console.error('게시글 좋아요 실패:', error);
      throw error;
    }
  }, []);

  // 댓글 추가
  const addComment = useCallback(async (postId, commentData) => {
    try {
      const response = await boardApi.createComment(fetchDataRef.current, postId, {
        content: commentData.content,
        parentCommentId: commentData.parentId || null
      });
      
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const commentResult = response.data || (response.isSuccess ? response.result : response);
      
      // currentUser에서 ID 추출
      let myUserId = 'currentUser';
      if (currentUser) {
        myUserId = currentUser.memberId || currentUser.id;
      }
      
      return {
        id: commentResult.commentId,
        boardId: commentResult.boardId,
        author: commentResult.writer,
        content: commentResult.content,
        date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }),
        userId: myUserId,
        replyLevel: commentData.replyLevel || 0,
        parentId: commentResult.parentId,
        likes: 0,
        isLiked: false
      };
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  }, [currentUser]);

  // 댓글 수정
  const updateComment = useCallback(async (postId, commentId, updates) => {
    try {
      const response = await boardApi.updateComment(fetchDataRef.current, postId, commentId, updates.content);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const commentResult = response.data || (response.isSuccess ? response.result : response);
      return {
        id: commentResult.commentId,
        content: commentResult.content,
        writer: commentResult.writer
      };
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  }, []);

  // 댓글 삭제
  const deleteComment = useCallback(async (postId, commentId) => {
    try {
      await boardApi.deleteComment(fetchDataRef.current, postId, commentId);
      return { success: true };
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }, []);

  // 댓글 좋아요 토글
  const toggleCommentLike = useCallback(async (postId, commentId) => {
    try {
      const result = await boardApi.toggleCommentLike(fetchDataRef.current, postId, commentId);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const likeResult = result.data || (result.isSuccess ? result.result : result);
      return { 
        success: true, 
        liked: likeResult === 1,
        likeChange: likeResult 
      };
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
      throw error;
    }
  }, []);

  // 검색 함수 
  const searchPosts = useCallback(async (keyword, category = 'general', page = 0, size = 20) => {
    try {
      setLoading(true);
      const searchSize = size || (isPC ? 6 : 20);
      const response = await boardApi.searchBoards(fetchDataRef.current, keyword, category, page, searchSize);
      // useCustomFetch가 axios response를 반환하므로 .data 추출
      const searchData = response.data || (response.isSuccess ? response.result : response);
      const searchResults = searchData.content.map(transformBoardData);
      
      setPosts(searchResults);
      setHasMore(!searchData.last);
      return searchResults;
    } catch (error) {
      console.error('게시글 검색 실패:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isPC, transformBoardData]);

  // 내 게시글/댓글인지 확인하는 헬퍼 함수들
  const isMyPost = useCallback((post) => {
    if (!currentUser || !post) return false;
    
    // currentUser에서 ID 추출
    const myId = currentUser.memberId || currentUser.id;
    
    return myId === post.userId;
  }, [currentUser]);

  const isMyComment = useCallback((comment) => {
    if (!currentUser || !comment) return false;
    
    // currentUser에서 ID 추출
    const myId = currentUser.memberId || currentUser.id;
    
    return myId === comment.userId;
  }, [currentUser]);

  return {
    // 상태값들
    posts,
    loading,
    hasMore,
    userType,
    currentUser,
    
    // 기본 게시글 함수들
    canCreatePost,
    loadPosts,
    loadMore,
    setPage,
    getPost,
    addPost,
    updatePost,
    deletePost,
    togglePostLike,
    searchPosts,
    
    // 댓글 관련 함수들
    getComments,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    
    // 권한 확인 헬퍼 함수들
    isMyPost,
    isMyComment,
    loadCurrentUser
  };
};

export default usePosts;
