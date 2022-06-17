import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import { useAppSelector } from "../../Hooks/store";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../../Hooks/useWindowDimensions";
import ProfileBox from "../../Components/Common/ProfileBox";
import CustomModal from "../../Components/Common/CustomModal";
import Tweet from "../../Components/Common/Tweet";


const Profile = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        <Suspense fallback={<FullScreenLoader />}>
          <Image
            src={"https://loremflickr.com/640/480/abstract"}
            className="banner-image"
            alt="banner"
            layout="responsive"
            width={100}
            height={width! > 880 ? 15 : 45}
          />
          <ProfileBox setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />
          <CustomModal setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />
          <ContentContainer>
            <FilterBox filterList={filterList} />
            <Tweet/>
          </ContentContainer>
        </Suspense>
      )}
    </>
  );
};

export default Profile;

const ContentContainer = styled.div`
  width: min(95%, 102.4rem);
  margin-inline: auto;
  padding-block: 2rem;

  @media screen and (min-width: 40em) {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 2rem;
  }

 
`;
