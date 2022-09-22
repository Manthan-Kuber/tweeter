import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import {
  api,
  useCreateTweetMutation,
  useGetHashtagsQuery,
  useGetHomeTweetsQuery,
  useGetSuggestedFollowersQuery,
  useLazyGetHashtagsQuery,
  useLazyGetHomeTweetsQuery,
  useLazyGetSuggestedFollowersQuery,
} from "../app/services/api";
import ContentLoader from "../Components/Common/ContentLoader";
import CreateTweet from "../Components/Common/CreateTweet";
import ScrollToTopButton from "../Components/Common/ScrollToTopButton";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import TweetsDataList from "../Components/Common/TweetsDataList";
import { useAppDispatch, useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

var hashtagLimit = 6;
var suggestedFollowerLimit = 4;

const Home = () => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const [createTweet] = useCreateTweetMutation();
  const [hasMoreTrends, setHasMoreTrends] = useState(false);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const dispatch = useAppDispatch();
  const [GetHomeTweetsTrigger] = useLazyGetHomeTweetsQuery();
  const [GetSuggestedFollowersTrigger] = useLazyGetSuggestedFollowersQuery();
  const { data: suggestedFollowersArray } = useGetSuggestedFollowersQuery(0);
  const { data: HomeTweetsData } = useGetHomeTweetsQuery(0);
  const [homeTweetsSkip, setHomeTweetsSkip] = useState(1);
  const { data: HashtagDataArray } = useGetHashtagsQuery({
    hashtagArrayLength: 0,
    hashtagLimit: 6,
  });
  const [GetTrendsTrigger] = useLazyGetHashtagsQuery();

  const getHashtags = async () => {
    try {
      if (HashtagDataArray !== undefined) {
        if (HashtagDataArray.length < hashtagLimit) setHasMoreTrends(false);
        else {
          const newTrendsData = await GetTrendsTrigger({
            hashtagArrayLength: HashtagDataArray.length,
            hashtagLimit,
          }).unwrap();
          if (newTrendsData.length < HashtagDataArray.length)
            setHasMoreTrends(false);
          dispatch(
            api.util.updateQueryData(
              "getHashtags",
              {
                hashtagArrayLength: 0,
                hashtagLimit: 6,
              },
              (trendData) => {
                newTrendsData.map((newTrend) => trendData.push(newTrend));
              }
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(() => (
        <ToastMessage>Error in Fetching HashTags</ToastMessage>
      ));
    }
  };

  const getSuggestedFollowers = async () => {
    try {
      if (suggestedFollowersArray !== undefined) {
        if (suggestedFollowersArray.length < suggestedFollowerLimit) {
          setHasMoreSuggestions(false);
        } else {
          const newFollowerData = await GetSuggestedFollowersTrigger(
            suggestedFollowersArray.length
          ).unwrap();
          console.log(newFollowerData);
          if (newFollowerData.length < suggestedFollowersArray.length)
            setHasMoreSuggestions(false);
          dispatch(
            api.util.updateQueryData(
              "getSuggestedFollowers",
              0,
              (tweetData) => {
                newFollowerData.map((newFollower) =>
                  tweetData.push(newFollower)
                );
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

  const getMoreHomeTweets = async () => {
    try {
      if (HomeTweetsData !== undefined) {
        const { data: newTweetData } = await GetHomeTweetsTrigger(
          homeTweetsSkip
        ).unwrap();
        if (newTweetData.length === 0) setHasMoreTweets(false);
        else setHomeTweetsSkip(homeTweetsSkip + 1);
        dispatch(
          api.util.updateQueryData("getHomeTweets", 0, (tweetData) => {
            newTweetData.map((newTweet) => tweetData.data.push(newTweet));
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Fetching Tweets</ToastMessage>);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isHashtagPresent = /#[a-z]+/gi;
    const fileArray = fileList.map((item) => item.file);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
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

  return (
    <Container>
      <ScrollToTopButton />
      <Toaster />
      <div>
        <CreateTweetWrapper>
          <CreateTweet
            isReplyImageVisible={false}
            placeholder="Whats happening?"
            btnText="Tweet"
            variant="Home"
            message={message}
            setMessage={setMessage}
            fileList={fileList}
            setFileList={setFileList}
            onSubmit={onSubmit}
          />
        </CreateTweetWrapper>
        {HomeTweetsData !== undefined ? (
          <TweetsDataList
            TweetsData={HomeTweetsData}
            hasMoreTweets={hasMoreTweets}
            getMoreTweets={getMoreHomeTweets}
          />
        ) : (
          <ContentLoader size={32} />
        )}
      </div>
      <aside>
        <Trends
          trendList={HashtagDataArray}
          getHashtags={getHashtags}
          hasMore={hasMoreTrends}
          setHasMoreTrends={setHasMoreTrends}
        />
        <SuggestedFollow
          suggestedFollowList={suggestedFollowersArray}
          getSuggestedFollowers={getSuggestedFollowers}
          hasMoreSuggestions={hasMoreSuggestions}
          setHasMoreSuggestions={setHasMoreSuggestions}
        />
      </aside>
    </Container>
  );
};

export default Home;

const CreateTweetWrapper = styled.div`
  margin-bottom: 4rem;
`;

const Container = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;
  gap: 2rem;
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: 25em) {
    width: min(85%, 350px);
  }

  @media screen and (min-width: 30em) {
    width: 90%;
  }

  @media screen and (min-width: 40em) {
    width: min(85%, 120rem);
    aside {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media screen and (min-width: 60em) {
    width: min(95%, 120rem);
    display: grid;
    grid-template-columns: 3fr 1fr;
    aside {
      display: revert;
    }
  }
`;
