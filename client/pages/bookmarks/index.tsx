import { useState } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import {
  api,
  useGetBookmarksQuery,
  useLazyGetBookmarksQuery,
} from "../../app/services/api";
import { Loader } from "../../Components/Common/FullScreenLoader";
import NoTweetsToShow from "../../Components/Common/NoTweetsToShow";
import ScrollToTopButton from "../../Components/Common/ScrollToTopButton";
import Tweet from "../../Components/Common/Tweet";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import { ToastMessage } from "../../styles/Toast.styles";
import { ScrollerMessage } from "../[userId]";

var tweetLimit = 10;

function Bookmarks() {
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const { data: BookmarksData } = useGetBookmarksQuery(0);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [getBookmarksTrigger] = useLazyGetBookmarksQuery();
  const dispatch = useAppDispatch();

  const getMoreBookmarks = async () => {
    try {
      if (BookmarksData !== undefined) {
        if (BookmarksData.data.length < tweetLimit) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await getBookmarksTrigger(
            BookmarksData.data.length / tweetLimit
          ).unwrap();
          if (newTweetData.length < BookmarksData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData("getBookmarks", 0, (tweetData) => {
              newTweetData.map((newTweet) => tweetData.data.push(newTweet));
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(() => (
        <ToastMessage>Error in Fetching Bookmarks</ToastMessage>
      ));
    }
  };

  return (
    <Container>
      <ScrollToTopButton/>
      {BookmarksData !== undefined && (
        <InfiniteScroll
          dataLength={BookmarksData.data.length}
          next={getMoreBookmarks}
          hasMore={hasMoreTweets}
          loader={<ScrollerMessage>Loading...</ScrollerMessage>}
          endMessage={
            <ScrollerMessage>You have reached the end...</ScrollerMessage>
          }
        >
          {BookmarksData.data.length === 0 ? (
            <NoTweetsToShow message="No Tweets To Show !" />
          ) : (
            BookmarksData.data.map((tweet) =>
              !BookmarksData.data ? (
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
                  isLiked={tweet.liked.length === 0 ? false : true}
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
    </Container>
  );
}

export default Bookmarks;

const Container = styled.div`
  width: min(95%, 60rem);
  margin-inline: auto;
  padding-block: 2rem;
`;
