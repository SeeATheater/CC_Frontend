
// 공통 상수
export const API_ENDPOINTS = {
  // 게시판
  BOARDS: '/boards',
  HOT_BOARDS: '/boards/hot',
  BOARD_SEARCH: '/boards/search',
  BOARD_LIKE: (boardId) => `/boards/${boardId}/like`,
  
  // 댓글
  COMMENTS: (boardId) => `/boards/${boardId}/comments`,
  COMMENT_UPDATE: (boardId, commentId) => `/boards/${boardId}/comments/${commentId}`,
  COMMENT_DELETE: (boardId, commentId) => `/boards/${boardId}/comments/${commentId}`,
  COMMENT_LIKE: (boardId, commentId) => `/boards/${boardId}/comments/${commentId}/like`,
  
  // 이미지
  PRESIGNED_URL: '/s3/uploadUrl',
  PRESIGNED_URLS: '/s3/uploadUrls',
  IMAGE_SAVE: '/images',
  IMAGE_SAVE_MULTIPLE: '/images/multipleImages',
  IMAGE_DELETE: (keyName) => `/s3/delete?keyName=${encodeURIComponent(keyName)}`,
  IMAGE_EXISTS: '/s3/exist',
  
  // 사용자
  MY_PAGE: '/member/myPage',
  
  // 신고
  REPORTS: '/boards/reports'
};

export const BOARD_TYPE = {
  general: 'NORMAL',
  promotion: 'PROMOTION',
  hot: 'NORMAL' // HOT은 일반 게시판에서 좋아요 10개 이상인 것들
};
