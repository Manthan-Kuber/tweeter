import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import axiosApi from "../app/services/axiosApi";
import CreateTweet from "../Components/Common/CreateTweet";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import { useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

const Home = ({
  initialTrendData,
  initialSuggestedFollowersData,
}: {
  initialTrendData: any;
  initialSuggestedFollowersData: any;
}) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const [trendSkip, setTrendSkip] = useState<number>(1);
  const [suggestedFollowerSkip, setSuggestedFollowerSkip] = useState<number>(1);

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

  const [hasMoreTrends, setHasMoreTrends] = useState(true);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(true);

  const token = useAppSelector((state) => state.auth.token);

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const getHashtags = async () => {
    try {
      setTrendSkip((prev) => ++prev);
      const response = await axiosApi.get(
        `home/hashtags/${6 * trendSkip + 1}/6`
      );
      if (hashtagArray.length > 12) setHasMoreTrends(false);
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
      setSuggestedFollowerSkip((prev) => ++prev);
      const response = await axiosApi.get(
        `home/people/${4 * suggestedFollowerSkip}/4`
      );
      if (suggestedFollowersArray.length > 4) setHasMoreSuggestions(false);
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

  // const getTweets = async () => {
  //   try {
  //     const response = await axiosApi.get(`home/tweets/0`, requestConfig);
  //     console.log(response.data);
  //     //set state and set loading to false
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const createTweet = async (formData: FormData) => {
    try {
      const response = await axiosApi.post("/tweets", formData, requestConfig);
      console.log(response);
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

  const onSubmit = (e: React.FormEvent) => {
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
    createTweet(formData);
  };

  // useEffect(() => {
  //   getTweets()
  // },[] )

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

export const getStaticProps: GetStaticProps = async () => {
  const endPoints = ["home/hashtags/0/6", "home/people/0/4"];
  try {
    const requests = endPoints.map((endP) => axiosApi.get(endP));
    const responses = await Promise.all(requests);
    return {
      props: {
        initialTrendData: responses[0].data,
        initialSuggestedFollowersData: responses[1].data,
      },
    };
  } catch (err) {
    console.log(err);
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
    width: min(75%,295px);
  }

  @media screen and (min-width: 30em){
   width:80%;
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
