import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import { useAppSelector } from "../../Hooks/store";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";
import Image from "next/image";

const Home: NextPage = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter();

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setIsLoading((prev) => !prev);
      }, 1500);
      replace("/register");
    } else if (token) {
      setIsLoading(false);
    }
  }, [token]);

  const filterList = {
    1: "Tweets",
    2: "Tweets & Replies",
    3: "Media",
    4: "Likes",
  };

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div>
          <Image
            src={"https://loremflickr.com/640/480/abstract"}
            className="banner-image"
            alt="banner"
            layout="responsive"
            width={100}
            height={25}
          />
          <ProfileContainer />
          <Container>
            <FilterBox filterList={filterList} />
            <div>Profile content goes here</div>
          </Container>
        </div>
      )}
    </>
  );
};

export default Home;

const Container = styled.div`
  width: min(95%, 102.4rem);
  margin-inline: auto;
  padding-block: 2rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;

  //delete later
  & > div:last-child {
    background-color: green;
  }
`;
const ProfileContainer = styled.div`
  width: min(95%, 102.4rem);
  background-color: white;
  padding-block: 2.5rem;
  font: 600 1.4rem var(--ff-poppins);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  height: 20rem;
  margin-inline: auto;
  margin-top: -3.5%;
  position: relative;
`;
