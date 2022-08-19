import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart } from "react-icons/ai";
import { MdOutlineModeComment } from "react-icons/md";
import styled from "styled-components";
import { useLikeCommentMutation } from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";
import { OptionsWrapper, OptionWrapper } from "./TweetOptions";

const TweetReplies = (props: TweetRepliesProps) => {
  const [isLikeActive, setIsLikeActive] = useState(false);
  const commentCreationDate = new Date(props.commentCreationDate);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [likeComment] = useLikeCommentMutation();

  const optionsList = [
    {
      id: 1,
      name: "Comments",
      icon: <MdOutlineModeComment size={16} />,
      isActive: isCommentActive,
      activeColor: "black",
      onClick: () => {
        setIsCommentActive((prev) => !prev);
      },
    },
    {
      id: 2,
      name: "Like",
      icon: <AiOutlineHeart size={16} />,
      isActive: isLikeActive,
      activeColor: "hsla(0, 79%, 63%, 1)",
      onClick: async () => {
        try{
          await likeComment(props.commentId).unwrap();
          setIsLikeActive((prev) => !prev);
        }catch (error) {
          toast.error(() => <ToastMessage>Error in Liking Comment</ToastMessage>);
        }
      },
    },
  ];

  return (
    <RepliesContainer>
      <ReplyContainer>
        <RepliesImageWrapper>
          <RepliesImage src={props.authorProfilePic} width={42} height={37} />
        </RepliesImageWrapper>
        <ReplyWrapper>
          <AnotherReplyWrapper>
            <AuthorWrapper>
              <span>{props.authorName}</span>
              <span>{commentCreationDate.toDateString()}</span>
            </AuthorWrapper>
            <UserName>@ {props.authorUserName}</UserName>
            <TweetText>{props.commentText}</TweetText>
            <ModifiedOptionsWrapper>
              {optionsList.map((option) => (
                <ModifiedOptionWrapper
                  key={option.id}
                  onClick={option.onClick}
                  isActive={option.isActive}
                  activeColor={option.activeColor}
                >
                  {option.icon}
                  {option.name === "Like" && props.likesCount !== 0 && (
                    <span>{props.likesCount}</span>
                  )}
                  {option.name === "Comments" && props.replyCount.length !== 0 && (
                    <span>{props.replyCount.length}</span>
                  )}
                </ModifiedOptionWrapper>
              ))}
            </ModifiedOptionsWrapper>
          </AnotherReplyWrapper>
          {isCommentActive && (
            <p>
              Map and Display Comment Replies here (New component
              TweetCommentReplies)
            </p>
          )}
        </ReplyWrapper>
      </ReplyContainer>
    </RepliesContainer>
  );
};
export default TweetReplies;

const CommentReplyContainer = styled.div`
  
`

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

const UserName = styled.span`
  font: 500 1.2rem var(--ff-noto);
  color: hsla(0, 0%, 51%, 1);
`;

const ReplyWrapper = styled.div`
  flex: 1;
`;

const AnotherReplyWrapper = styled.div`
  border-radius: 6px;
  padding: 0.5rem 1rem;
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
  font: 400 1.6rem var(--ff-noto);
  color: hsla(0, 0%, 31%, 1);
  margin-top: 1rem;
`;

const RepliesImageWrapper = styled.div`
  align-self: flex-start;
`;

const ModifiedOptionsWrapper = styled(OptionsWrapper)`
  justify-content: revert;
  border-block: revert;
  gap: 3rem;
  margin-bottom: revert;
  margin-left: -0.75rem;
`;

const ModifiedOptionWrapper = styled(OptionWrapper)`
  padding: 0.75rem;
  margin-top: 1rem;
`;

// const LikesWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   line-height: 14px;
//   gap: 1rem;
//   font: 600 1.4rem var(--ff-noto);
//   color: hsla(0, 0%, 74%, 1);
//   margin-top: 1rem;
//   -moz-user-select: none;
//   -khtml-user-select: none;
//   -webkit-user-select: none;
//   user-select: none;
// `;

// const LikesContainer = styled.div<{ isLiked: boolean }>`
//   display: flex;
//   align-items: center;
//   line-height: 14px;
//   gap: 0.25rem;
//   cursor: pointer;
//   color: ${(props) =>
//     props.isLiked ? "hsla(0, 79%, 63%, 1)" : "hsla(0, 0%, 74%, 1)"};
// `;
