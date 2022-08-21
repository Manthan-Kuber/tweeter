import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart } from "react-icons/ai";
import { useLikeCommentMutation } from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";
import {
  RepliesContainer,
  ReplyContainer,
  RepliesImageWrapper,
  RepliesImage,
  ReplyWrapper,
  AnotherReplyWrapper,
  AuthorWrapper,
  UserName,
  TweetText,
  ModifiedOptionsWrapper,
  ModifiedOptionWrapper,
} from "./TweetReplies";

const CommentReply = (props: CommentReplyProps) => {
  const commentCreationDate = new Date(props.replyCreationDate);
  const [isLikeActive, setIsLikeActive] = useState(false);
  const [likeComment] = useLikeCommentMutation();

  const handleLike = async () => {
    try {
      await likeComment(props.replyId).unwrap();
      setIsLikeActive((prev) => !prev);
    } catch (error) {
      toast.error(() => <ToastMessage>Error in Liking Comment</ToastMessage>);
    }
  };

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
            <UserName>@ {props.authorUsername}</UserName>
            <TweetText>{props.reply}</TweetText>
            <ModifiedOptionsWrapper>
              <ModifiedOptionWrapper
                onClick={handleLike}
                isActive={isLikeActive}
                activeColor={"hsla(0, 79%, 63%, 1)"}
              >
                <AiOutlineHeart size={16} />
                {props.likesCount !== 0 && <span>{props.likesCount}</span>}
              </ModifiedOptionWrapper>
            </ModifiedOptionsWrapper>
          </AnotherReplyWrapper>
        </ReplyWrapper>
      </ReplyContainer>
    </RepliesContainer>
  );
};
export default CommentReply;
