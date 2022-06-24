import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import FullScreenLoader from "../Components/Common/FullScreenLoader";
import { useAppSelector } from "../Hooks/store";
import styled from "styled-components";
import FilterBox from "../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../Hooks/useWindowDimensions";
import ProfileBox from "../Components/Common/ProfileBox";
import CustomModal from "../Components/Common/CustomModal";
import Tweet from "../Components/Common/Tweet";
import { GetStaticPaths, GetStaticProps } from "next";
import { useGetUsersQuery } from "../app/services/api";
import FollowerModalContent from "../Components/Common/FollowerModalContent";

const Profile = (props: any) => {
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;
  const { replace } = router;
  const { width } = useWindowSize();
  const { data } = useGetUsersQuery(userId as string);

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
          {data?.data[0].coverPic !== undefined && (
            <Image
              src={data?.data[0].coverPic}
              className="banner-image"
              alt="banner"
              layout="responsive"
              width={100}
              height={width! > 880 ? 15 : 45}
            />
          )}
          <ProfileBox
            setModalIsOpen={setModalIsOpen}
            modalIsOpen={modalIsOpen}
            name={data?.data[0].name as string}
            profilePic={data?.data[0].profilePic}
            username={data?.data[0].username as string}
            followers={data?.data[0].followers as number}
            following={data?.data[0].following as number}
            bio={data?.data[0].bio as string}
          />
          <CustomModal
            setModalIsOpen={setModalIsOpen}
            modalIsOpen={modalIsOpen}
            name={data?.data[0].name as string}
            username={data?.data[0].username as string}
            followers={data?.data[0].followers as number}
            following={data?.data[0].following as number}
            modalTitle={`${data?.data[0].name as string} is Following`}
          >
            <FollowerModalContent />
          </CustomModal>
          <ContentContainer>
            <FilterBox filterList={filterList} />
            <Tweet />
            <p>{props.message}</p>
          </ContentContainer>
        </Suspense>
      )}
    </>
  );
};

export default Profile;

//Update getStaticPaths here,use next-redux-wrapper
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

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
