
// API 엔드포인트 상수
export const TICKET_ENDPOINTS = {
  SHOW_SIMPLE: (amateurShowId) => `/tickets/${amateurShowId}/showSimple`,
  SHOW_ROUNDS: (amateurShowId) => `/tickets/${amateurShowId}/selectRound`,
  TICKET_TYPES: (amateurShowId) => `/tickets/${amateurShowId}/selectTicket`,
  RESERVE_TICKET: (amateurShowId, amateurRoundId, amateurTicketId) => 
    `/tickets/${amateurShowId}/reserve?amateurRoundId=${amateurRoundId}&amateurTicketId=${amateurTicketId}`,
  KAKAO_PAY_READY: (tempTicketId) => `/kakaoPay/ready?tempTicketId=${tempTicketId}`
};

// 예매 관련 API 서비스
export const ticketingAPI = {
  // 공연 간략 정보 조회
  getShowSimple: async (fetchData, amateurShowId) => {
    const response = await fetchData(TICKET_ENDPOINTS.SHOW_SIMPLE(amateurShowId), 'GET');
    return response;
  },

  // 회차(날짜) 선택 정보 조회
  getShowRounds: async (fetchData, amateurShowId) => {
    const response = await fetchData(TICKET_ENDPOINTS.SHOW_ROUNDS(amateurShowId), 'GET');
    return response;
  },

  // 티켓 종류 조회
  getTicketTypes: async (fetchData, amateurShowId) => {
    const response = await fetchData(TICKET_ENDPOINTS.TICKET_TYPES(amateurShowId), 'GET');
    return response;
  },

  // 티켓 예매
  reserveTicket: async (fetchData, amateurShowId, amateurRoundId, amateurTicketId, requestData) => {
    const response = await fetchData(
      TICKET_ENDPOINTS.RESERVE_TICKET(amateurShowId, amateurRoundId, amateurTicketId),
      'POST',
      requestData
    );
    return response;
  },

  // 카카오페이 결제 준비
  prepareKakaoPayment: async (fetchData, tempTicketId) => {
    const response = await fetchData(
      TICKET_ENDPOINTS.KAKAO_PAY_READY(tempTicketId),
      'POST'
    );
    return response;
  }  
};

export default ticketingAPI;