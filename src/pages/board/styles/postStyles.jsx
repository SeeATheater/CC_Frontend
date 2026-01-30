
import styled from 'styled-components';

// 반응형 미디어쿼리 상수
const media = {
  mobile: `@media (max-width: 767px)`,
  pc: `@media (min-width: 768px)`,
};

// 포스트 리스트 페이지 포스트 컴포넌트
export const PostItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  ${media.pc} {
    margin: 0px 100px 0px 60px;
    padding: 16px 20px 16px 0px;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const PostTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;  /* 한줄까지만 넘어가면 ...처리 */
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${media.pc} {
    font-size: 16px;
    // width: 800px;
    margin-bottom: 8px;
  }
`;

export const PostContent = styled.p`
  font-size: 13px;
  color: #000000;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;  /* 한줄까지만 넘어가면 ...처리 */
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${media.pc} {
    font-size: 14px;
    // width: 800px;
    margin-bottom: 16px;
  }
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #999;

  ${media.pc} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;
    font-size: 12px;
  }
`;

export const PostAuthor = styled.span`
  color: #929292;
`;

export const PostDate = styled.span`
  color: #929292;
`;

export const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  ${media.pc} {
    gap: 12px;
  }
`;

export const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #929292;
  
  ${media.pc} {
    gap: 0px;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;
