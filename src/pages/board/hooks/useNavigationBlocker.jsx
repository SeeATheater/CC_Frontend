import { useEffect, useRef } from 'react';

/**
 * 페이지 이탈을 차단하고 콜백을 실행하는 커스텀 훅
 * @param {function} onBlock - 차단 시 실행할 콜백 (모달 열기)
 */
const useNavigationBlocker = (onBlock) => {
  // onBlock 함수의 최신 참조를 유지
  const onBlockRef = useRef(onBlock);

  // onBlock이 바뀔 때마다 ref 업데이트
  useEffect(() => {
    onBlockRef.current = onBlock;
  }, [onBlock]);

  useEffect(() => {
    // 뒤로가기 차단
    const handlePopState = () => {
      // 다시 더미 히스토리 추가
      window.history.pushState(null, '', window.location.href);
      // ref를 통해 최신 onBlock 함수 호출
      onBlockRef.current();
    };

    // 초기 더미 히스토리 추가
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // 의존성 배열 비움 (한 번만 실행)
};

export default useNavigationBlocker;