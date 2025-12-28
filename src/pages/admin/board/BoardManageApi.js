import useCustomFetch from '@/utils/hooks/useCustomFetch';

/**
 * 관리자용 게시글 상세 조회 (댓글 포함)
 * Detail 페이지에서만 사용 - 목록은 useCustomFetch 직접 사용
 */
export const getAdminBoardDetail = async (fetchData, boardId) => {
  try {
    const url = `/admin/boards/${boardId}`;
    const response = await fetchData(url, 'GET');
    
    return response?.data?.result || response?.result || response?.data || response;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 게시글/댓글 삭제
 * @param {string} targetType - 삭제 대상 타입 (BOARD 또는 COMMENT)
 * @param {number} targetId - 삭제 대상 ID
 */
export const deleteTarget = async (fetchData, targetType, targetId) => {
  try {
    const url = `/admin/boards?targetType=${targetType}&targetId=${targetId}`;
    const response = await fetchData(url, 'DELETE');
    
    // 삭제 API는 보통 빈 응답을 반환하므로 성공으로 간주
    return { success: true, isSuccess: true };
  } catch (error) {
    console.error('삭제 실패:', error);
    throw error;
  }
};

/**
 * 게시글 삭제 (편의 함수)
 */
export const deleteBoard = async (fetchData, boardId) => {
  return deleteTarget(fetchData, 'BOARD', boardId);
};

/**
 * 댓글 삭제 (편의 함수)
 */
export const deleteComment = async (fetchData, commentId) => {
  return deleteTarget(fetchData, 'COMMENT', commentId);
};

/**
 * 게시판 타입 변환 유틸리티
 */
export const convertBoardType = (boardType) => {
  const typeMap = {
    'NORMAL': '일반',
    'PROMOTION': '홍보'
  };
  return typeMap[boardType] || '일반';
};

/**
 * 날짜 포맷팅 유틸리티 (YYYY.MM.DD / HH:mm)
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day} / ${hours}:${minutes}`;
};

/**
 * 간단한 날짜 포맷팅 (MM.DD)
 */
export const formatSimpleDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${month}.${day}`;
};