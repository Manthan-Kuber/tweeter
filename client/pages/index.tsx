import { AxiosError } from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import axiosApi from "../app/services/axiosApi";
import CreateTweet from "../Components/Common/CreateTweet";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";
import { useAppSelector } from "../Hooks/store";
import { ToastMessage } from "../styles/Toast.styles";

const Home = () => {
  const trendList = [
    { id: 0, tagName: "#programming", tweetCount: "213k Tweets" },
    { id: 1, tagName: "#devchallenges", tweetCount: "123k Tweets" },
    { id: 2, tagName: "#frontend", tweetCount: "69k Tweets" },
    { id: 3, tagName: "#backend", tweetCount: "55k Tweets" },
    { id: 4, tagName: "#69DaysOfCode", tweetCount: "25k Tweets" },
    { id: 5, tagName: "#johhnydepp", tweetCount: "5k Tweets" },
  ];

  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );

  const token = useAppSelector((state) => state.auth.token);

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
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
    // const isHashtagPresent = /^#[^ !@#$%^&*(),.?":{}|<>]*$/gi;
    const isHashtagPresent = /#[a-z]+/gi;
    const fileArray = fileList.map((item) => item.file);
    console.log(fileArray);
    console.log(message);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("shared", "true");
    formData.append("tweet", message);
    if (isHashtagPresent.test(message)) {
      const hashtagArray = message.match(isHashtagPresent);
      console.log(hashtagArray);
      for (let i = 0; i < hashtagArray!.length; i++) {
        formData.append("hashtags", hashtagArray![i]);
      }
    }
    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileArray[i]);
      console.log(fileArray[i]);
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
        <Trends trendList={trendList} />
        <SuggestedFollow />
      </aside>
    </Container>
  );
};

export default Home;

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
