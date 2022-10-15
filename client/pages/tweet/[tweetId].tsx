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
import ContentLoader from "../../Components/Common/ContentLoader";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import Tweet from "../../Components/Common/Tweet";
import TweetsDataList from "../../Components/Common/TweetsDataList";
import { useAppDispatch } from "../../Hooks/store";
import { ToastMessage } from "../../styles/Toast.styles";

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
        if (TweetReplyData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetTweetRepliesTrigger({
            tweetId: data?.data[0]._id ?? "", //change
            skip: TweetReplyData.data.length / 10,
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

  if (tweetId === undefined || data === undefined) return <FullScreenLoader />;

  const tweet = data?.data[0];
  return (
    <Container>
      <TweetReplyHeading>Tweet Replies</TweetReplyHeading>
      <TweetAndRepliesWrapper>
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
          variant="tweetReply"
          TweetReplyData={TweetReplyData}
          fetchReply={false}
        />
        <RepliesText as="h2">Replies Received</RepliesText>
        <ReplyTweetsListWrapper>
          {TweetReplyData !== undefined ? (
            <TweetsDataList
              TweetsData={TweetReplyData.data}
              hasMoreTweets={hasMoreTweets}
              getMoreTweets={getMoreTweetReplies}
              setHasMoreTweets={setHasMoreTweets}
              variant="tweetReply"
            />
          ) : (
            <ContentLoader size={32} />
          )}
        </ReplyTweetsListWrapper>
      </TweetAndRepliesWrapper>
    </Container>
  );
}
export default TweetPage;


const ReplyTweetsListWrapper = styled.div`
  margin-top: -2rem;
  padding-bottom: 2rem;
`;

const Container = styled.div`
  width: min(95%, 85.5rem);
  margin-inline: auto;
  padding-top: 1rem;
`;

const TweetReplyHeading = styled.h1`
  font-weight: 700;
  font-family: var(--ff-noto);
  color: #333;
  margin-bottom: 1rem;
`;

const RepliesText = styled(TweetReplyHeading)`
  margin-left:2rem;
  margin-bottom: 6rem;
  font-size:1.6rem;
`

export const LoaderWrapper = styled.div`
  width: fit-content;
  margin-inline: auto;
  overflow: hidden;
`;

const TweetAndRepliesWrapper = styled.div`
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
`;
