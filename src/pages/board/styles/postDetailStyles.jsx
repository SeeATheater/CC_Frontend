
import styled from 'styled-components';

// 반응형 미디어쿼리 상수
const media = {
  mobile: `@media (max-width: 767px)`,
  pc: `@media (min-width: 768px)`,
};

// 메인 컨텐츠 영역 스타일
export const ContentArea = styled.div`
  ${media.mobile} {
    height: 100vh;
    overflow-y: auto;
    background: white;
    padding-bottom: 80px;
  }
  ${media.pc} {
    margin-left: 60px;
    margin-top: 100px;
    margin-right: 100px;
  }
  
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;
// 컨테이너
export const PostDetailContainer = styled.div`
  padding: 20px;
  background: white;
  ${media.pc} {
    padding: 0px;
  }
`;

// 게시글 헤더 - 제목,작성,날짜
export const PostHeader = styled.div`
  margin-bottom: 19px;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 500px;
  margin-bottom: 12px;

  ${media.pc} {
    font-size: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid #DDDDDD;
  }
`;

export const PostAuthor = styled.span`
  color: #929292;
`;

export const PostDate = styled.span`
  color: #929292;
`;

export const PostTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1.4;

  ${media.pc} {
    font-size: 24px;
    margin-bottom: 12px;
  }
`;

// 게시글 본문 영역1 - 글
export const PostContent = styled.div`
  font-size: 13px;
  color: #000000;
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;

  ${media.pc} {
    margin-top: 40px;
    font-size: 16px;
  }
`;

// 게시글 본문 영역2 - 이미지 + 이미지 페이지네이션
export const ImageContainer = styled.div`
  margin-bottom: 20px;
`;

export const PostImage = styled.img`
  ${media.mobile} {
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  ${media.pc} {
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

export const ImagePagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const PaginationDot = styled.button.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['active'].includes(prop)
})`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#FF8585' : '#DDDDDD'};
  cursor: pointer;
  transition: background-color 0.2s;
`;

// 게시글 좋아요
export const PostActions = styled.div`
  margin-bottom: 20px;
`;

export const LikeButton = styled.button.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['liked'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 16px;
  border: 1px solid ${props => props.liked ? '#FF8585' : '#FFBEBB'};
  background: transparent;
  border-radius: 14px;
  color: #FF8585;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #fff5f5;
  }
`;

export const LikeIcon = styled.img`
  width: 20px;
  height: 20px;
`;

// 구분선
export const Divider = styled.div`
  ${media.mobile} {
    height: 4px;
    background-color: #FFF1EF;
    width: calc(100% + 40px);
    margin-left: -20px;
  }
  ${media.pc} { }
`;

// 댓글 영역 스타일
export const CommentsSection = styled.div`
  margin-top: 20px;

    ${media.pc} {
    padding-top: 20px;
    margin-top: 100px;
    border-top: 1px solid #DDDDDD;
    }
`;

export const CommentsSectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 36px;

  ${media.pc} {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

// 개별 댓글 컴포넌트
export const CommentItem = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !['replyLevel'].includes(prop)
})`
  margin-bottom: 16px;
  padding-left: ${props => props.replyLevel ? props.replyLevel * 24 + 4 : 0}px;
  position: relative;

  ${media.pc} {
    margin-top: 20px;
    margin-bottom: 0px;
    padding-bottom: 20px;
    border-bottom: 1px solid #DDDDDD;
    padding-left: ${props => props.replyLevel ? props.replyLevel * 28 + 4 : 0}px;
  }
`;
// 대댓글 탭
export const ReplyIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 4px;
  display: flex;
  gap: 4px;
`;
// 댓글 헤더 스타일
export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

export const CommentAuthor = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #929292;

  ${media.pc} {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
  }
`;

export const CommentDate = styled.span`
  margin-left: 12px;
  font-size: 10px;
  font-weight: 500;
  color: #929292;

  ${media.pc} {
    margin-left: 16px;
    font-size: 14px;
  }
`;
// 좋아요 대댓글 버튼관련 스타일
export const CommentHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
export const CommentButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
`;
export const CommentIcon = styled.img`
  width: 20px;
  height: 20px;

  ${media.pc} {
    width: 28px;
    height: 28px;
    color: #FFBEBB;
  }
`;

// 댓글 수정, 삭제 관련 (댓글 작성자에게만)
export const CommentActionButton = styled.button`
  ${media.mobile} {
    background: none;
    border: none;
    font-size: 10px;
    color: #929292;
    cursor: pointer;
    padding: 2px 4px;

    &.delete {
      color: #FF3737;
    }
  }

  ${media.pc} {
    background: none;
    border: none;
    font-size: 14px;
    color: #FFBEBB;
    cursor: pointer;
    padding: 2px 4px;
  }
  
  &:hover {
    opacity: 0.7;
  }
`;

// 댓글 본문
export const CommentContent = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  line-height: 1.5;
  margin-bottom: 8px;

  ${media.pc} {
    font-size: 16px;
    margin-top: 16px;
    margin-bottom: 12px;
    font-weight: 400;
  }
`;

// 댓글 좋아요 
export const CommentLikeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #F67676;
  margin-top: 8px;
  padding-left: 0;

  ${media.pc} {
    font-size: 14px;
    color: #929292;
  }
`;

// 댓글 작성 관련
export const CommentInputContainer = styled.div`
  ${media.mobile} {
    padding: 12px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 100;
  }
  ${media.pc} {
    margin-bottom: 40px;
    height: 200px;
    border: 1px solid #DDDDDD;
    border-radius: 3px;
  }
`;

export const CommentInput = styled.textarea`
  ${media.mobile} {
    flex: 1;
    padding: 12px;
    border: 2px solid #FFF1EF;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
    height: 60px;
    outline: none;
    font-family: inherit;
  }
  ${media.pc} {
    height: 100%;
    font-size: 16px;
    resize: none;
    outline: none;
    border: none;
    font-family: inherit;
  }
  
  &:focus {
    border-color: #FF8585;
  }
  
  &::placeholder {
    color: #999;
    ${media.pc} { color: #929292; }
  }
`;

export const CommentSubmitButton = styled.button`
  height: 60px;
  padding: 12px 16px;
  background: #FF8585;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  ${media.pc} {
    height: 100%;
    width: 80px;
    padding: 6px 20px;
    background: #DDDDDD;
    border-radius: 3px;
  }
  
  &:hover {
    background: #ff7070;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;