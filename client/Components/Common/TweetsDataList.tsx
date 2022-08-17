import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ScrollerMessage } from "../../pages/[userId]";
import { Loader } from "./FullScreenLoader";
import NoTweetsToShow from "./NoTweetsToShow";
import Tweet from "./Tweet";

const TweetsDataList = ({
  TweetsData,
  getMoreTweets,
  hasMoreTweets,
  setHasMoreTweets,
}: TweetsDataListProps) => {
  useEffect(() => {
    if (TweetsData.data.length === 10) setHasMoreTweets(true);
  }, [TweetsData]);

  return (
    <InfiniteScroll
      dataLength={TweetsData.data.length}
      next={getMoreTweets}
      hasMore={hasMoreTweets}
      loader={<ScrollerMessage>Loading...</ScrollerMessage>}
      endMessage={
        TweetsData.data.length !== 0 && (
          <ScrollerMessage>You have reached the end...</ScrollerMessage>
        )
      }
    >
      {TweetsData.data.length === 0 ? (
        <NoTweetsToShow message="No Tweets To Show !" />
      ) : (
        TweetsData.data.map((tweet) =>
          !TweetsData.data ? (
            <Loader size={32} color={"var(--clr-primary)"} />
          ) : (
            // <TweetWrapper> Add loader or skeleton
            //   <TweetBox>
            //     <Skeleton count={5} />
            //   </TweetBox>
            // </TweetWrapper>
            <Tweet
              key={tweet._id}
              authorName={tweet.creator[0].name}
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
            />
          )
        )
      )}
    </InfiniteScroll>
  );
};
export default TweetsDataList;
