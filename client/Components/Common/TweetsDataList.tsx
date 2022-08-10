import { useState } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { api, useGetProfileTweetsQuery, useLazyGetProfileTweetsQuery } from "../../app/services/api";
import { useAppDispatch } from "../../Hooks/store";
import { ScrollerMessage } from "../../pages/[userId]";
import { ToastMessage } from "../../styles/Toast.styles";
import { Loader } from "./FullScreenLoader";
import NoTweetsToShow from "./NoTweetsToShow";
import Tweet from "./Tweet";

var tweetLimit = 10;

const TweetsDataList = ({ userId,TweetsData, ...props }: TweetsDataListProps) => {
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [GetProfileTweetsTrigger] = useLazyGetProfileTweetsQuery();
  const dispatch = useAppDispatch();
    
//   const { data: TweetsData } = useGetProfileTweetsQuery(
//     { userId, skip: 0 },
//     { refetchOnMountOrArgChange: true }
//   ); //Resets api cache on mount

  const getMoreTweets = async () => {
    try {
      if (TweetsData !== undefined) {
        if (TweetsData.data.length < tweetLimit) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsTrigger({
            userId,
            skip: TweetsData.data.length / tweetLimit,
          }).unwrap();
          if (newTweetData.length < TweetsData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getProfileTweets",
              { userId, skip: 0 },
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
  return (
    <>
      {TweetsData !== undefined && (
        <InfiniteScroll
          dataLength={TweetsData.data.length}
          next={getMoreTweets}
          hasMore={hasMoreTweets}
          loader={<ScrollerMessage>Loading...</ScrollerMessage>}
          endMessage={
            <ScrollerMessage>You have reached the end...</ScrollerMessage>
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
      )}
    </>
  );
};
export default TweetsDataList;
