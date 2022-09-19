import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import {
  api,
  useCreateTweetMutation,
  useGetHomeTweetsQuery,
  useGetSuggestedFollowersQuery,
  useLazyGetHomeTweetsQuery,
  useLazyGetSuggestedFollowersQuery,
} from "../app/services/api";
import axiosApi from "../app/services/axiosApi";
import ContentLoader from "../Components/Common/ContentLoader";
import CreateTweet from "../Components/Common/CreateTweet";
import ScrollToTopButton from "../Components/Common/ScrollToTopButton";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import TweetsDataList from "../Components/Common/TweetsDataList";
import { logOut } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

var hashtagLimit = 6;
var suggestedFollowerLimit = 4;

const Home = ({
  initialTrendData = [],
  isAuthenticated = true,
}: {
  initialTrendData: any;
  isAuthenticated: boolean;
}) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  useEffect(() => {
    if (!isAuthenticated) {
      async () => await axiosApi.get("clearcookie");
      dispatch(logOut());
    }
  }, []);

  const [hashtagArray, setHashtagArray] = useState<
    Array<{ id: string; tagName: string; tweetCount: string }>
  >(
    initialTrendData.map((item: typeof initialTrendData) => ({
      id: item._id,
      tagName: item.hashtag,
      tweetCount: `${item.tweets}`,
    }))
  );

  const [createTweet] = useCreateTweetMutation();
  const [hasMoreTrends, setHasMoreTrends] = useState(false);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [GetHomeTweetsTrigger] = useLazyGetHomeTweetsQuery();
  const [GetSuggestedFollowersTrigger] = useLazyGetSuggestedFollowersQuery();
  const { data: suggestedFollowersArray } = useGetSuggestedFollowersQuery(0);
  const { data: HomeTweetsData } = useGetHomeTweetsQuery(0);
  const [homeTweetsSkip, setHomeTweetsSkip] = useState(1);

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const getHashtags = async () => {
    try {
      const response = await axiosApi.get(
        `home/hashtags/${hashtagArray.length}/${hashtagLimit}`,
        requestConfig
      );
      if (response.data.length < hashtagLimit) setHasMoreTrends(false);
      response.data.map((item: typeof response.data) =>
        setHashtagArray((prev) => [
          ...prev,
          {
            id: item._id,
            tagName: item.hashtag,
            tweetCount: `${item.tweets}`,
          },
        ])
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getSuggestedFollowers = async () => {
    try {
      if (suggestedFollowersArray !== undefined) {
        if (suggestedFollowersArray.length < suggestedFollowerLimit) {
          setHasMoreTweets(false);
        } else {
          const newFollowerData = await GetSuggestedFollowersTrigger(
            suggestedFollowersArray.length
          ).unwrap();
          console.log(newFollowerData);
          if (newFollowerData.length < suggestedFollowersArray.length)
            setHasMoreTweets(false);
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
          trendList={hashtagArray}
          getHashtags={getHashtags}
          hasMore={hasMoreTrends}
          setHasMoreTrends={setHasMoreTrends}
        />
        {suggestedFollowersArray !== undefined ? (
          <SuggestedFollow
            suggestedFollowList={suggestedFollowersArray}
            getSuggestedFollowers={getSuggestedFollowers}
            hasMore={hasMoreSuggestions}
            setHasMoreSuggestions={setHasMoreSuggestions}
          />
        ) : (
          <ContentLoader size={32} />
        )}
      </aside>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies.jwt;
  try {
    const response = await axiosApi.get(`home/hashtags/0/${hashtagLimit}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return {
      props: {
        initialTrendData: response.data,
      },
    };
  } catch (err) {
    console.log((err as AxiosError).response?.status);
    if ((err as AxiosError).response?.status === 401) {
      return {
        props: {
          isAuthenticated: false,
        },
      };
    }
  }
  return {
    props: {},
  };
};

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
