import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import axiosApi from "../app/services/axiosApi";
import CreateTweet from "../Components/Common/CreateTweet";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import { useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

const Home = ({ initialTrendData }: { initialTrendData: any }) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  let [skip, setSkip] = useState<number>(1);

  const [hashtagArray, setHashtagArray] = useState<
    Array<{ id: string; tagName: string; tweetCount: string }>
  >(
    initialTrendData.map((item: typeof initialTrendData) => ({
      id: item._id,
      tagName: item.hashtag,
      tweetCount: `${100 * Math.random()}`,
    }))
  );

  const [hasMore, setHasMore] = useState(true);

  const token = useAppSelector((state) => state.auth.token);

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const getHashtags = async () => {
    try {
      const response = await axiosApi.get(`home/hashtags/${6 * skip}/6`);
      setSkip(skip++);
      if (hashtagArray.length > 12) setHasMore(false);
      response.data.map((item: typeof response.data) =>
        setHashtagArray((prev) => [
          ...prev,
          {
            id: item._id,
            tagName: item.hashtag,
            tweetCount: `${100 * Math.random()}`,
          },
        ])
      );
    } catch (error) {
      console.log(error);
    }
  };

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
          hasMore={hasMore}
        />
        <SuggestedFollow />
      </aside>
    </Container>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const response = await axiosApi.get(`home/hashtags/0/6`);
  console.log(response.data);
  return {
    props: {
      initialTrendData: response.data,
    },
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
    aside {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media screen and (min-width: 40em) {
    aside {
      padding-inline: 5rem;
    }
  }

  @media screen and (min-width: 55em) {
    display: grid;
    grid-template-columns: 3fr 1fr;
    aside {
      padding-inline: revert;
      display: revert;
    }
  }
`;
