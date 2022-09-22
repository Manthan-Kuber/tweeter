import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import {
  api,
  useGetTweetQuery,
  useGetTweetRepliesQuery,
  useLazyGetTweetRepliesQuery,
} from "../../app/services/api";
import FullScreenLoader, {
  Loader,
} from "../../Components/Common/FullScreenLoader";
import Tweet from "../../Components/Common/Tweet";
import TweetsDataList from "../../Components/Common/TweetsDataList";
import { useAppDispatch } from "../../Hooks/store";
import { ToastMessage } from "../../styles/Toast.styles";

var tweetLimit = 10;

function TweetPage() {
  const {
    query: { tweetId },
  } = useRouter();
  const { data } = useGetTweetQuery(tweetId as string);
  const { data: TweetReplyData } = useGetTweetRepliesQuery({
    tweetId: data?.data[0]._id ?? "", //change
    skip: 0,
  });
  const [hasMoreTweets, setHasMoreTweets] = useState(false);
  const dispatch = useAppDispatch();
  const [GetTweetRepliesTrigger] = useLazyGetTweetRepliesQuery();

  const getMoreTweetReplies = async () => {
    try {
      if (TweetReplyData !== undefined) {
        if (TweetReplyData.data.length < tweetLimit) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetTweetRepliesTrigger({
            tweetId: data?.data[0]._id ?? "", //change
            skip: TweetReplyData.data.length / tweetLimit,
          }).unwrap();
          if (newTweetData.length < TweetReplyData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getTweetReplies",
              {
                tweetId: data?.data[0]._id ?? "",
                skip: 0,
              },
              (tweetData) => {
                newTweetData.map((newTweet) => tweetData.data.push(newTweet));
              }
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Fetching Tweets</ToastMessage>);
    }
  };

  if (tweetId !== undefined && data !== undefined) {
    const tweet = data?.data[0];
    return (
      <Container>
        <Tweet
          key={tweet._id}
          authorName={tweet.creator[0].name}
          authorId={tweet.creator[0]._id}
          authorUserName={tweet.creator[0].username}
          authorFollowers={6969} //Change
          authorProfilePic={tweet.creator[0].profilePic}
          mediaList={tweet.media}
          authorTweet={tweet.tweet}
          tweetId={tweet._id}
          tweetCreationDate={tweet.createdAt}
          isSaved={tweet.saved.length === 0 ? false : true}
          isLiked={
            tweet.liked !== undefined && tweet.liked.length === 0 ? false : true
          }
          isRetweeted={tweet.retweeted.length === 0 ? false : true}
          commentCount={tweet.commentCount[0]}
          likes={tweet.likes}
          retweetedUsers={tweet.retweetedUsers}
          savedBy={tweet.savedBy}
          variant="tweetPage"
          TweetReplyData={TweetReplyData}
          fetchReply={false}
        />
        <TweetReplyHeading>Tweet Replies</TweetReplyHeading>
        <TweetDataListWrapper>
          {TweetReplyData !== undefined ? (
            <TweetsDataList
              TweetsData={TweetReplyData}
              hasMoreTweets={hasMoreTweets}
              getMoreTweets={getMoreTweetReplies}
              variant="tweetReply"
            />
          ) : (
            <LoaderWrapper>
              <Loader size={32} color="var(--clr-primary)" />
            </LoaderWrapper>
          )}
        </TweetDataListWrapper>
      </Container>
    );
  }
  return <FullScreenLoader />;
}
export default TweetPage;

const Container = styled.div`
  width: min(95%, 85.5rem);
  margin-inline: auto;
  padding-top: 1rem;
`;

const TweetReplyHeading = styled.h1`
  font-weight: 700;
  font-family: var(--ff-noto);
  color: #333;
`;

export const LoaderWrapper = styled.div`
  width: fit-content;
  margin-inline: auto;
  overflow: hidden;
`;

const TweetDataListWrapper = styled.div`
  background-color: white;
  margin-top: 2rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
`;
