import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart } from "react-icons/ai";
import { MdOutlineModeComment } from "react-icons/md";
import styled from "styled-components";
import {
  useCreateReplyMutation,
  useLazyGetCommentRepliesQuery,
  useLikeCommentMutation,
} from "../../app/services/api";
import { useAppSelector } from "../../Hooks/store";
import { ToastMessage } from "../../styles/Toast.styles";
import CommentReply from "./CommentReply";
import CreateTweet, { TweetImageArrayWrapper } from "./CreateTweet";
import { OptionsWrapper, OptionWrapper } from "./TweetOptions";

const TweetReplies = (props: TweetRepliesProps) => {
  const [isLikeActive, setIsLikeActive] = useState(props.isLiked);
  const commentCreationDate = new Date(props.commentCreationDate);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [likeComment] = useLikeCommentMutation();
  const [createReply] = useCreateReplyMutation();
  const [GetCommentRepliesTrigger, { data: CommentRepliesData }] =
    useLazyGetCommentRepliesQuery();
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const currentUserPfp = useAppSelector((state) => state.auth.user?.profilePic);

  const onSubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    const isHashtagPresent = /#[a-z]+/gi;
    const fileArray = fileList.map((item) => item.file);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("comment", message);
    formData.append("commentId", commentId);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileArray[i]);
    }
    if (isHashtagPresent.test(message)) {
      const hashtagArray = message.match(isHashtagPresent);
      if (hashtagArray !== null) {
        for (let i = 0; i < hashtagArray.length; i++) {
          formData.append("hashtags", hashtagArray[i]);
        }
      }
    }
    try {
      await createReply(formData).unwrap();
      toast.success(() => (
        <ToastMessage>Created Reply Successfully</ToastMessage>
      ));
    } catch (error) {
      toast.error(() => <ToastMessage>Error in Creating Reply</ToastMessage>);
    }
  };

  const optionsList = [
    {
      id: 1,
      name: "Comments",
      icon: <MdOutlineModeComment size={16} />,
      isActive: isCommentActive,
      activeColor: "black",
      onClick: async () => {
        if (isCommentActive) setIsCommentActive((prev) => !prev);
        else {
          try {
            await GetCommentRepliesTrigger(props.commentId).unwrap();
            setIsCommentActive((prev) => !prev);
          } catch (error) {
            <ToastMessage>Error in Fetching Comment</ToastMessage>;
          }
        }
      },
    },
    {
      id: 2,
      name: "Like",
      icon: <AiOutlineHeart size={16} />,
      isActive: isLikeActive,
      activeColor: "hsla(0, 79%, 63%, 1)",
      onClick: async () => {
        try {
          await likeComment(props.commentId).unwrap();
          setIsLikeActive((prev) => !prev);
        } catch (error) {
          toast.error(() => (
            <ToastMessage>Error in Liking Comment</ToastMessage>
          ));
        }
      },
    },
  ];

  console.log(CommentRepliesData);

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
            <ImageWrapper numOfImages={props.mediaList?.length ?? 0}>
              {props.mediaList?.map((mediaItemUrl, index) => (
                <TweetImage
                  key={`${mediaItemUrl} ${index}`}
                  src={mediaItemUrl}
                  layout="responsive"
                  width={100}
                  height={30}
                />
              ))}
            </ImageWrapper>
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
                  {option.name === "Comments" &&
                    props.replyCount.length !== 0 && (
                      <span>{props.replyCount[0]}</span>
                    )}
                </ModifiedOptionWrapper>
              ))}
            </ModifiedOptionsWrapper>
          </AnotherReplyWrapper>
          {isCommentActive && (
            <>
              <CreateTweet
                isReplyImageVisible={true}
                placeholder={"Tweet your reply"}
                btnText={"Reply"}
                message={message}
                setMessage={setMessage}
                fileList={fileList}
                setFileList={setFileList}
                onSubmit={(e) => onSubmit(e, props.commentId)}
                replyImageUrl={currentUserPfp}
              />
              {CommentRepliesData?.data.map((reply) => (
                <CommentReply
                  key={reply._id}
                  replyId={reply._id}
                  reply={reply.comment}
                  replyCreationDate={reply.createdAt}
                  authorId={reply.author[0]._id}
                  authorName={reply.author[0].name}
                  authorUsername={reply.author[0].username}
                  authorProfilePic={reply.author[0].profilePic}
                  likesCount={reply.likes}
                  isLiked={reply.liked.length === 0 ? false : true}
                />
              ))}
            </>
          )}
        </ReplyWrapper>
      </ReplyContainer>
    </RepliesContainer>
  );
};
export default TweetReplies;

const TweetImage = styled(Image)`
  border-radius: 6px;
`;

const ImageWrapper = styled(TweetImageArrayWrapper)`
  width: 100%;
  margin-top: revert;
`;

export const RepliesContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid hsla(0, 0%, 95%, 1);
`;

export const RepliesImage = styled(Image)`
  border-radius: 6px;
`;

export const ReplyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserName = styled.span`
  font: 500 1.2rem var(--ff-noto);
  color: hsla(0, 0%, 51%, 1);
`;

export const ReplyWrapper = styled.div`
  flex: 1;
`;

export const AnotherReplyWrapper = styled.div`
  border-radius: 6px;
  padding: 0.5rem 1rem;
`;

export const AuthorWrapper = styled.div`
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

export const TweetText = styled.span`
  display: block;
  font: 400 1.6rem var(--ff-noto);
  color: hsla(0, 0%, 31%, 1);
  margin-top: 1rem;
`;

export const RepliesImageWrapper = styled.div`
  align-self: flex-start;
`;

export const ModifiedOptionsWrapper = styled(OptionsWrapper)`
  justify-content: revert;
  border-block: revert;
  gap: 3rem;
  margin-bottom: revert;
  margin-left: -0.75rem;
`;

export const ModifiedOptionWrapper = styled(OptionWrapper)`
  padding: 0.75rem;
  margin-top: 1rem;
`;
