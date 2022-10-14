import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import {
  api,
  useGetBookmarksQuery,
  useLazyGetBookmarksQuery,
} from "../../app/services/api";
import ContentLoader from "../../Components/Common/ContentLoader";
import ScrollToTopButton from "../../Components/Common/ScrollToTopButton";
import TweetsDataList from "../../Components/Common/TweetsDataList";
import { useAppDispatch } from "../../Hooks/store";
import { ToastMessage } from "../../styles/Toast.styles";

function Bookmarks() {
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const { data: BookmarksData } = useGetBookmarksQuery(0);
  const [getBookmarksTrigger] = useLazyGetBookmarksQuery();
  const dispatch = useAppDispatch();

  const getMoreBookmarks = async () => {
    try {
      if (BookmarksData !== undefined) {
        if (BookmarksData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await getBookmarksTrigger(
            BookmarksData.data.length / 10
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
      <ScrollToTopButton />
      <TweetHeading>Bookmarks</TweetHeading>
      {BookmarksData !== undefined ? (
        <TweetsDataList
          TweetsData={BookmarksData.data}
          getMoreTweets={getMoreBookmarks}
          hasMoreTweets={hasMoreTweets}
          setHasMoreTweets={setHasMoreTweets}
        />
      ) : (
        <ContentLoader size={32} />
      )}
    </Container>
  );
}

export default Bookmarks;

const Container = styled.div`
  width: min(95%, 95rem);
  margin-inline: auto;
  padding-block: 2rem;
`;

const TweetHeading = styled.h1`
  font-weight: 700;
  font-family: var(--ff-noto);
  color: #333;
  margin-bottom: 2rem;
`;
