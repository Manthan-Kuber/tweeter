import Image from "next/image";
import { AiOutlineRetweet } from "react-icons/ai";
import styled from "styled-components";
import ProfileInfo from "./ProfileInfo";
import TweetOptions from "./TweetOptions";
import TweetReplies from "./TweetReplies";
import CreateTweet from "./CreateTweet";
import { useState } from "react";

const Tweet = (props: TweetProps) => {
  const { fileList, message, setMessage, setFileList, onSubmit } = props;
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  return (
    <TweetWrapper>
      <RetweetWrapper>
        <AiOutlineRetweet size={14} />
        {/* To be Conditionally Rendered */}
        <span>RasPutin Retweeted</span>
      </RetweetWrapper>
      <TweetBox>
        <ProfileInfo name={props.authorName} followerCount={props.authorFollowers} profilePic={props.authorProfilePic}/>
        <TweetText>
          {props.authorTweet}
        </TweetText>
        <ImageWrapper>
          {props.mediaList.map(mediaItemUrl => (
            <TweetImage
            key={mediaItemUrl}
            src={mediaItemUrl}
            layout="responsive"
            width={100}
            height={30}
          />
          ))}

        </ImageWrapper>
        <TweetInfo>
          <span>449 Comments</span>
          <span>59K Retweets</span>
          <span>234 Saved</span>
        </TweetInfo>
        <TweetOptions setIsCommentVisible={setIsCommentVisible} />
        {/* To be Conditionally Rendered */}
        <CreateTweet
          isReplyImageVisible={true}
          placeholder="Tweet your reply"
          btnText="Reply"
          message={message}
          setMessage={setMessage}
          fileList={fileList}
          setFileList={setFileList}
          onSubmit={onSubmit}
        />
        {/* Fetch data after comment clicked */}
        {isCommentVisible && Array.from(Array(10).keys()).map((index) => (
          <div key={index}>
            <TweetReplies />
          </div>
        ))}
      </TweetBox>
    </TweetWrapper>
  );
};
export default Tweet;

const TweetWrapper = styled.div`
  margin-top: 2rem;
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

const TweetBox = styled.div`
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

const ImageWrapper = styled.div`
  width: 100%;
`;

const TweetImage = styled(Image)`
  border-radius: 6px;
`;
