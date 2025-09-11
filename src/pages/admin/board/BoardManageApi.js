const BASE_URL = import.meta.env.VITE_APP_SERVER_URL;
const ACCESS_TOKEN = import.meta.env.VITE_APP_ACCESS_TOKEN;

// 공통 API 호출 함수
const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // 응답이 비어있는지 확인
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // 응답 본문이 비어있거나 content-length가 0인 경우
    if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
      console.log('API Response: Empty response or non-JSON content'); // 디버깅용 로그
      return { success: true }; // 성공 응답으로 처리
    }

    // 응답 텍스트 먼저 확인
    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      console.log('API Response: Empty response body'); // 디버깅용 로그
      return { success: true }; // 성공 응답으로 처리
    }

    // JSON 파싱 시도
    try {
      const data = JSON.parse(responseText);
      console.log('API Response:', data); // 디버깅용 로그
      return data;
    } catch (parseError) {
      console.log('JSON Parse Error, returning text response:', responseText);
      return { success: true, message: responseText };
    }

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// 관리자용 게시글 목록 조회
export const getAdminBoards = async (page = 0, size = 20) => {
  return apiCall(`/admin/boards?page=${page}&size=${size}`);
};

// 관리자용 게시글 상세 조회 (댓글 포함)
export const getAdminBoardDetail = async (boardId) => {
  return apiCall(`/admin/boards/${boardId}`);
};

// 게시글/댓글 삭제
export const deleteTarget = async (targetType, targetId) => {
  return apiCall(`/admin/boards?targetType=${targetType}&targetId=${targetId}`, {
    method: 'DELETE',
  });
};

// 게시글 삭제 (편의 함수)
export const deleteBoard = async (boardId) => {
  return deleteTarget('BOARD', boardId);
};

// 댓글 삭제 (편의 함수)
export const deleteComment = async (commentId) => {
  return deleteTarget('COMMENT', commentId);
};