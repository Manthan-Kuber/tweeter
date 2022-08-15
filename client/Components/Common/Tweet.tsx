import Image from "next/image";
import { AiOutlineDelete, AiOutlineRetweet } from "react-icons/ai";
import styled from "styled-components";
import ProfileInfo from "./ProfileInfo";
import TweetOptions from "./TweetOptions";
import TweetReplies from "./TweetReplies";
import CreateTweet, { TweetImageArrayWrapper } from "./CreateTweet";
import { useState } from "react";
import {
  CancelButton,
  DiscardButton,
  SubToastMessage,
  ToastMessage,
} from "../../styles/Toast.styles";
import toast from "react-hot-toast";
import {
  useCreateCommentMutation,
  useDeleteTweetMutation,
  useLazyGetCommentsQuery,
} from "../../app/services/api";

const Tweet = (props: TweetProps) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const [isCommentButtonClicked, setIsCommentButtonClicked] = useState(false);
  const [deleteTweet] = useDeleteTweetMutation();
  const [createComment] = useCreateCommentMutation();
  const [commentFetchTrigger, { data: commentsData }] =
    useLazyGetCommentsQuery();
  const tweetCreationDate = new Date(props.tweetCreationDate);
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isSaved, setIsSaved] = useState(props.isSaved);
  const [isRetweeted, setIsRetweeted] = useState(props.isRetweeted);

  const onSubmit = async (e: React.FormEvent, tweetId: string) => {
    e.preventDefault();
    const fileArray = fileList.map((item) => item.file);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("comment", message);
    formData.append("tweetId", tweetId);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileArray[i]);
    }
    try {
      await createComment(formData).unwrap();
      toast.success(() => (
        <ToastMessage>Created Comment Successfully</ToastMessage>
      ));
    } catch (error) {
      toast.error(() => <ToastMessage>Error in Creating Comment</ToastMessage>);
    }
  };

  const onDeleteButtonClick = (tweetId: string) => {
    toast.dismiss();
    toast(
      (t) => (
        <span>
          <ToastMessage>Delete Tweet?</ToastMessage>
          <SubToastMessage>
            This cannot be undone and it will be removed from your profile, the
            timeline of any accounts that follow you.
          </SubToastMessage>
          <DiscardButton
            onClick={async () => {
              try {
                await deleteTweet(tweetId).unwrap();
                toast.success(() => (
                  <ToastMessage>Deleted Tweet Successfully</ToastMessage>
                ));
              } catch (error) {
                toast.error(() => (
                  <ToastMessage>Error in Deleting Tweet</ToastMessage>
                ));
              }
              toast.dismiss(t.id);
            }}
          >
            Delete
          </DiscardButton>
          <CancelButton
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            Cancel
          </CancelButton>
        </span>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return (
    <TweetWrapper>
      {props.isRetweeted && (
        <RetweetWrapper>
          <AiOutlineRetweet size={14} />{" "}
          <span>{props.authorName} Retweeted</span>
        </RetweetWrapper>
      )}
      <TweetBox>
        <ProfileInfoWrapper>
          <ProfileInfo
            name={props.authorName}
            username={props.authorUserName}
            tweetCreationDate={tweetCreationDate.toDateString()}
            followerCount={props.authorFollowers}
            profilePic={props.authorProfilePic}
          />
          <DeleteIconWrapper onClick={() => onDeleteButtonClick(props.tweetId)}>
            <DeleteIcon size={24} />
          </DeleteIconWrapper>
        </ProfileInfoWrapper>
        <TweetText>{props.authorTweet}</TweetText>
        <ImageWrapper numOfImages={props.mediaList.length}>
          {props.mediaList.map((mediaItemUrl, index) => (
            <TweetImage
              key={`${mediaItemUrl} ${index}`}
              src={mediaItemUrl}
              layout="responsive"
              width={100}
              height={30}
            />
          ))}
        </ImageWrapper>
        <TweetInfo>
          <span>{props.commentCount || 0} Comments</span>
          <span>{props.retweetedUsers || 0} Retweets</span>
          <span>{props.savedBy || 0} Saved</span>
        </TweetInfo>
        <TweetOptions
          setIsCommentButtonClicked={setIsCommentButtonClicked}
          tweetId={props.tweetId}
          commentFetchTrigger={commentFetchTrigger}
          isLiked={isLiked}
          isSaved={isSaved}
          isRetweeted={isRetweeted}
          setIsLiked={setIsLiked}
          setIsSaved={setIsSaved}
          setIsRetweeted={setIsRetweeted}
        />
        {isCommentButtonClicked && (
          <CreateTweet
            isReplyImageVisible={true}
            placeholder="Tweet your reply"
            btnText="Reply"
            message={message}
            setMessage={setMessage}
            fileList={fileList}
            setFileList={setFileList}
            onSubmit={(e) => onSubmit(e, props.tweetId)}
            replyImageUrl={props.authorProfilePic}
          />
        )}
        {isCommentButtonClicked &&
          commentsData?.data.comments.map((comment) => (
            <TweetReplies
              key={comment._id}
              commentText={comment.comment}
              likesCount={comment.likes}
              authorName={comment.author[0].name}
              authorUserName={comment.author[0].username}
              authorProfilePic={comment.author[0].profilePic}
              commentCreationDate={comment.createdAt}
            />
          ))}
      </TweetBox>
    </TweetWrapper>
  );
};
export default Tweet;

const ProfileInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteIconWrapper = styled.div`
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  padding: 8px;
  transition: all 0.4s;
  &:hover {
    background-color: rgba(130, 130, 130, 0.2);
  }
  &:active {
    background-color: rgba(130, 130, 130, 0.7);
  }
  align-self: flex-start;
`;

const DeleteIcon = styled(AiOutlineDelete)`
  color: red;
`;

export const TweetWrapper = styled.div`
  margin-block: 2rem;
  @media screen and (min-width: 40em) {
    margin-top: revert;
  }
`;

const RetweetWrapper = styled.div`
  color: hsla(0, 0%, 51%, 1);
  font: 500 1.4rem var(--ff-poppins);
  line-height: 14px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const TweetBox = styled.div`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-family: var(--ff-noto);
  background-color: white;
  padding: 2rem;
`;

const TweetText = styled.span`
  font: 400 1.6rem var(--ff-noto);
  color: hsla(0, 0%, 31%, 1);
  margin-block: 2rem;
  display: inline-block;
`;

const TweetInfo = styled.span`
  display: flex;
  justify-content: flex-end;
  font: 500 1.2rem var(--ff-noto);
  color: hsla(0, 0%, 74%, 1);
  margin-block: 1rem;
  span {
    display: inline-block;
    margin-left: 1.5rem;
  }
`;

const ImageWrapper = styled(TweetImageArrayWrapper)`
  width: 100%;
  margin-top: revert;
`;

const TweetImage = styled(Image)`
  border-radius: 6px;
`;
