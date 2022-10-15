import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import ContentLoader from "./ContentLoader";
import NoTweetsToShow from "./NoTweetsToShow";
import ReplyModal from "./ReplyModal";
import Tweet from "./Tweet";

const TweetsDataList = ({
  TweetsData,
  getMoreTweets,
  hasMoreTweets,
  variant,
  setHasMoreTweets,
}: TweetsDataListProps) => {
  useEffect(() => {
    if (TweetsData.length === 10) setHasMoreTweets(true);
  }, [TweetsData]);

  return (
    <>
      <ReplyModal />
      <Toaster />
      <InfiniteScroll
        dataLength={TweetsData.length}
        next={getMoreTweets}
        hasMore={hasMoreTweets}
        loader={<ContentLoader size={32} />}
        scrollThreshold={0.95}
      >
        {TweetsData.length === 0 ? (
          <NoTweetsToShow message="No Tweets To Show !" />
        ) : (
          TweetsData.map((tweet, key) => (
            <>
              {variant === "tweetReply"  && <TweetSeparator />}
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
                  tweet.liked !== undefined && tweet.liked.length === 0
                    ? false
                    : true
                }
                isRetweeted={tweet.retweeted.length === 0 ? false : true}
                commentCount={tweet.commentCount[0]}
                likes={tweet.likes}
                retweetedUsers={tweet.retweetedUsers}
                savedBy={tweet.savedBy}
                variant={variant}
                fetchReply={tweet.fetchReply}
              />
            </>
          ))
        )}
      </InfiniteScroll>
    </>
  );
};
export default TweetsDataList;

const TweetSeparator = styled.hr`
  border: 1px solid hsla(0, 0%, 90%, 1);
  margin-bottom: 2rem;
`;
