import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import { useAppSelector } from "../../Hooks/store";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../../Hooks/useWindowDimensions";
import ProfileBox from "../../Components/Common/ProfileBox";

const Profile = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter();
  const { width } = useWindowSize();

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
            height={width! > 800 ? 20 : 45}
          />
          <ProfileBox />
          <ContentContainer>
            <FilterBox filterList={filterList} />
            <div>Profile content goes here</div>
          </ContentContainer>
        </div>
      )}
    </>
  );
};

export default Profile;

const ContentContainer = styled.div`
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
