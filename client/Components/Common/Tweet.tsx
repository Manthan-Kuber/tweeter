import Image from "next/image";
import { AiOutlineDelete, AiOutlineRetweet } from "react-icons/ai";
import styled from "styled-components";
import ProfileInfo from "./ProfileInfo";
import TweetOptions from "./TweetOptions";
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
  useCreateTweetMutation,
  useDeleteTweetMutation,
} from "../../app/services/api";
import { useAppSelector } from "../../hooks/store";
import CustomModal from "./CustomModal";
import { useRouter } from "next/router";
import Link from "next/link";

const Tweet = ({ TweetReplyData, ...props }: TweetProps) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const [isCommentButtonClicked, setIsCommentButtonClicked] = useState(false);
  const [createTweet] = useCreateTweetMutation();
  const [deleteTweet] = useDeleteTweetMutation();
  const tweetCreationDate = new Date(props.tweetCreationDate);
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isSaved, setIsSaved] = useState(props.isSaved);
  const [isRetweeted, setIsRetweeted] = useState(props.isRetweeted);
  const currentUserPfp = useAppSelector((state) => state.auth.user?.profilePic);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false); // Maybe lift up to stop scroll
  const { push } = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isHashtagPresent = /#[a-z]+/gi;
    const fileArray = fileList.map((item) => item.file);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("tweetId", props.tweetId);
    formData.append("shared", "true");
    formData.append("tweet", message);
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
      await createTweet(formData).unwrap();
      toast.success(() => (
        <ToastMessage>Created Tweet Successfully</ToastMessage>
      ));
    } catch (error) {
      toast.error(() => <ToastMessage>Error in creating Tweet</ToastMessage>);
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
    <>
      {/* Close Modal on submit  */}
      <CustomModal
        setModalIsOpen={setIsModalOpen}
        modalIsOpen={isModalOpen}
        modalHeight="fit-content"
        modalTitle={`Reply to ${props.authorUserName}'s Tweet`}
        shouldCloseOnOverlayClick={true}
      >
        <Tweet
          authorId={props.authorId}
          authorName={props.authorName}
          authorUserName={props.authorUserName}
          authorFollowers={props.authorFollowers}
          authorProfilePic={props.authorProfilePic}
          authorTweet={props.authorTweet}
          mediaList={props.mediaList}
          tweetId={props.tweetId}
          tweetCreationDate={props.tweetCreationDate}
          variant="inTweet"
          commentCount={0}
          isSaved={false}
          isLiked={false}
          isRetweeted={false}
          likes={0}
          retweetedUsers={0}
          savedBy={0}
        />
        <CreateTweet
          isReplyImageVisible={true}
          placeholder="Tweet your Reply"
          btnText="Reply"
          message={message}
          setMessage={setMessage}
          fileList={fileList}
          setFileList={setFileList}
          onSubmit={onSubmit}
          replyImageUrl={currentUserPfp}
          setIsModalOpen={setIsModalOpen}
          variant="inTweet"
        />
      </CustomModal>
      <TweetWrapper>
        {props.isRetweeted && (
          <RetweetWrapper>
            <AiOutlineRetweet size={14} />{" "}
            <span>{props.authorName} Retweeted</span>
          </RetweetWrapper>
        )}
        <TweetBox
          variant={props.variant}
          onClick={(e) => {
            e.stopPropagation();
            if (props.variant !== "inTweet") {
              push(`/tweet/${props.tweetId}`);
            }
          }}
        >
          <ProfileInfoContainer>
            <ProfileInfoWrapper
              variant={props.variant}
              onClick={(e) => {
                e.stopPropagation();
                if (props.variant !== "inTweet") {
                  push(`/profile/${props.authorId}`);
                }
              }}
            >
              <ProfileInfo
                name={props.authorName}
                username={props.authorUserName}
                tweetCreationDate={tweetCreationDate.toDateString()}
                followerCount={props.authorFollowers}
                profilePic={props.authorProfilePic}
              />
            </ProfileInfoWrapper>
            {currentUserId === props.authorId && props.variant !== "inTweet" && (
              <DeleteIconWrapper
                onClick={() => onDeleteButtonClick(props.tweetId)}
              >
                <DeleteIcon size={24} />
              </DeleteIconWrapper>
            )}
          </ProfileInfoContainer>
          <TweetText>{props.authorTweet}</TweetText>
          {props.variant !== "inTweet" ? (
            <ImagesWrapper numOfImages={props.mediaList.length}>
              {props.mediaList.map((mediaItemUrl, index) => (
                <ImageWrapper
                  onClick={(e) => e.stopPropagation()}
                  variant={props.variant}
                >
                  <Link href={mediaItemUrl} passHref>
                    <a target="_blank" rel="noopener noreferrer">
                      <Image
                        key={`${mediaItemUrl} ${index}`}
                        src={mediaItemUrl}
                        alt="Tweet Image"
                        layout="fill"
                        style={{ borderRadius: "16px" }}
                      />
                    </a>
                  </Link>
                </ImageWrapper>
              ))}
            </ImagesWrapper>
          ) : (
            props.mediaList.map((mediaItemUrl) => (
              <LinkText>{mediaItemUrl}</LinkText>
            ))
          )}
          {props.variant !== "inTweet" && (
            <TweetInfo>
              <span>{props.commentCount || 0} Comments</span>
              <span>{props.retweetedUsers || 0} Retweets</span>
              <span>{props.likes || 0} Likes</span>
              <span>{props.savedBy || 0} Saved</span>
            </TweetInfo>
          )}
          {props.variant !== "inTweet" && (
            <TweetOptions
              setIsModalOpen={setIsModalOpen}
              setIsCommentButtonClicked={setIsCommentButtonClicked}
              tweetId={props.tweetId}
              isLiked={isLiked}
              isSaved={isSaved}
              isRetweeted={isRetweeted}
              setIsLiked={setIsLiked}
              setIsSaved={setIsSaved}
              setIsRetweeted={setIsRetweeted}
            />
          )}
        </TweetBox>
      </TweetWrapper>
    </>
  );
};
export default Tweet;

const LinkText = styled.p`
  font-weight: 500;
  color: hsla(0, 0%, 31%, 1);
  font-family: var(--ff-noto);
`;

const ImageWrapper = styled.div<{
  variant?: "inTweet" | "tweetPage" | "tweetReply";
}>`
  position: relative;
  width: min(45rem, 100%);
  height: 15rem;
  border-radius: 16px;
  margin-inline: auto;
  @media screen and (min-width: 20em) {
    height: 20rem;
  }
  @media screen and (min-width: 55em) {
    height: 45rem;
  }
  transition: opacity 0.4s;
  &:hover {
    opacity: ${({ variant }) => variant !== "inTweet" && "0.75"};
  }
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileInfoWrapper = styled.div<{
  variant?: "inTweet" | "tweetPage" | "tweetReply";
}>`
  transition: opacity 0.4s;
  &:hover {
    opacity: ${({ variant }) => variant !== "inTweet" && "0.75"};
  }
`;

const DeleteIconWrapper = styled.div`
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  padding: 8px;
  transition: all 0.4s;
  &:hover {
    background-color: rgba(255, 0, 0, 0.2);
  }
  &:active {
    background-color: rgba(255, 0, 0, 0.7);
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

export const TweetBox = styled.div<{
  variant: "inTweet" | "tweetPage" | "tweetReply" | undefined;
}>`
  box-shadow: ${(props) =>
    props.variant === "inTweet" || props.variant === "tweetReply"
      ? "none"
      : "0px 2px 4px rgba(0, 0, 0, 0.05)"};
  border-radius: 8px;
  font-family: var(--ff-noto);
  background-color: ${({ variant }) =>
    variant === "tweetReply" ? "transparent" : "white"};
  padding: 2rem;
  cursor: ${({ variant }) => variant !== "inTweet" && "pointer"};
  transition: all 0.4s;
  &:hover {
    box-shadow: ${({ variant }) =>
      variant === "tweetReply" || variant === "inTweet"
        ? "none"
        : "0px 2px 4px 2px rgba(0, 0, 0, 0.1)"};
  }
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

const ImagesWrapper = styled(TweetImageArrayWrapper)`
  width: 100%;
  margin-top: revert;
`;
