import { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import { useCreateTweetMutation } from "../app/services/api";
import axiosApi from "../app/services/axiosApi";
import CreateTweet from "../Components/Common/CreateTweet";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import { logOut } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

var hashtagLimit = 6;
var suggestedFollowerLimit = 4;

const Home = ({
  initialTrendData=[],
  initialSuggestedFollowersData=[],
  isAuthenticated = true,
}: {
  initialTrendData: any;
  initialSuggestedFollowersData: any;
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
      tweetCount: `${item.tweets}k tweets`,
    }))
  );

  const [suggestedFollowersArray, setSuggestedFollowersArray] = useState<
    SuggestedFollowerResponse[]
  >(
    initialSuggestedFollowersData.map((item: SuggestedFollowerResponse) => ({
      id: item._id,
      bio: item.bio,
      name: item.name,
      profilePic: item.profilePic,
    }))
  );
  const [createTweet] = useCreateTweetMutation();
  const [hasMoreTrends, setHasMoreTrends] = useState(true);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(true);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

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
      //set hasMore false after all results are fecthed
      response.data.map((item: typeof response.data) =>
        setHashtagArray((prev) => [
          ...prev,
          {
            id: item._id,
            tagName: item.hashtag,
            tweetCount: `${item.tweets}k tweets`,
          },
        ])
      );
      // set loading to false
    } catch (error) {
      console.log(error);
    }
  };

  const getSuggestedFollowers = async () => {
    try {
      const response = await axiosApi.get(
        `home/people/${suggestedFollowersArray.length}/${suggestedFollowerLimit}`,
        requestConfig
      );
      //set hasMore false after all results are fecthed
      response.data.map((item: typeof response.data) =>
        setSuggestedFollowersArray((prev: typeof response.data) => [
          ...prev,
          {
            id: item._id,
            bio: item.bio,
            name: item.name,
            profilePic: item.profilePic,
          },
        ])
      );
      // set loading to false
    } catch (error) {
      console.log(error);
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
      for (let i = 0; i < hashtagArray!.length; i++) {
        formData.append("hashtags", hashtagArray![i]);
      }
    }
    try {
      await createTweet(formData).unwrap();
      toast.success(() => (
        <ToastMessage>Created Tweet Successfully</ToastMessage>
      ));
    } catch (error) {
      toast.error(() => (
        <ToastMessage>
          Error in creating Tweet: <br /> {(error as AxiosError).message}
        </ToastMessage>
      ));
    }
  };

  return (
    <Container>
      <Toaster />
      <div>
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
      </div>
      <aside>
        <Trends
          trendList={hashtagArray}
          getHashtags={getHashtags}
          hasMore={hasMoreTrends}
        />
        <SuggestedFollow
          suggestedFollowList={suggestedFollowersArray}
          getSuggestedFollowers={getSuggestedFollowers}
          hasMore={hasMoreSuggestions}
        />
      </aside>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const endPoints = [
    `home/hashtags/0/${hashtagLimit}`,
    `home/people/0/${suggestedFollowerLimit}`,
  ];
  const token = ctx.req.cookies.jwt;
  try {
    const requests = endPoints.map((endP) =>
      axiosApi.get(endP, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    );
    const responses = await Promise.all(requests);
    return {
      props: {
        initialTrendData: responses[0].data,
        initialSuggestedFollowersData: responses[1].data,
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

const Container = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;
  gap: 2rem;
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: 25em) {
    width: min(75%, 295px);
  }

  @media screen and (min-width: 30em) {
    width: 80%;
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
