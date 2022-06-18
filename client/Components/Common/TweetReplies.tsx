import Image from "next/image";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import styled from "styled-components";

interface Props {}
const TweetReplies = (props: Props) => {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <RepliesContainer>
      <ReplyContainer>
        <RepliesImageWrapper>
          <RepliesImage
            src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
            width={42}
            height={37}
          />
        </RepliesImageWrapper>
        <ReplyWrapper>
          <AnotherReplyWrapper>
            <AuthorWrapper>
              <span>Waquar Zakar</span>
              <span>24 August 1969</span>
            </AuthorWrapper>
            <TweetText>
              I’ve seen awe-inspiring things that I thought I’d never be able to
              explain to another person.
            </TweetText>
          </AnotherReplyWrapper>
          <LikesWrapper>
            <LikesContainer
              isLiked={isLiked}
              onClick={() => setIsLiked((prev) => !prev)}
            >
              <AiOutlineHeart size={14} />
              <span>Like</span>
            </LikesContainer>
            <span>1.4k Likes</span>
          </LikesWrapper>
        </ReplyWrapper>
      </ReplyContainer>
    </RepliesContainer>
  );
};
export default TweetReplies;

const RepliesContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid hsla(0, 0%, 95%, 1);
`;

const RepliesImage = styled(Image)`
  border-radius: 6px;
`;

const ReplyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReplyWrapper = styled.div``;

const AnotherReplyWrapper = styled.div`
  border-radius: 6px;
  padding: 0.5rem 1rem;
  background-color: hsla(0, 0%, 98%, 1);
`;

const AuthorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span:first-child {
    font: 500 1.4rem var(--ff-poppins);
  }

  span:last-child {
    font: 500 1.2rem var(--ff-noto);
    color: hsla(0, 0%, 74%, 1);
  }
`;

const TweetText = styled.span`
  display: block;
  font: 400 1.4rem var(--ff-noto);
  color: hsla(0, 0%, 31%, 1);
`;

const RepliesImageWrapper = styled.div`
  align-self: flex-start;
`;

const LikesWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 14px;
  gap: 1rem;
  font: 600 1.4rem var(--ff-noto);
  color: hsla(0, 0%, 74%, 1);
  margin-top: 1rem;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const LikesContainer = styled.div<{ isLiked: boolean }>`
  display: flex;
  align-items: center;
  line-height: 14px;
  gap: 0.25rem;
  cursor: pointer;
  color: ${(props) =>
    props.isLiked ? "hsla(0, 79%, 63%, 1)" : "hsla(0, 0%, 74%, 1)"};
`;
