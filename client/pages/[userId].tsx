import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FilterBox from "../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../Hooks/useWindowDimensions";
import ProfileBox from "../Components/Common/ProfileBox";
import CustomModal from "../Components/Common/CustomModal";
import FollowerInfo from "../Components/Common/FollowerInfo";
import axiosApi from "../app/services/axiosApi";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../Hooks/store";
import { logOut } from "../features/auth/authSlice";
import FullScreenLoader from "../Components/Common/FullScreenLoader";
import toast, { Toaster } from "react-hot-toast";
import {
  CancelButton,
  DiscardButton,
  SubToastMessage,
  ToastMessage,
} from "../styles/Toast.styles";
import EditProfile from "../Components/Common/EditProfile";
import { useGetTweetsQuery } from "../app/services/api";
import NoTweetsToShow from "../Components/Common/NoTweetsToShow";
import Tweet from "../Components/Common/Tweet";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [followerModalIsOpen, setFollowerModalIsOpen] = useState(false);
  const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false);
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const { width } = useWindowSize();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    profilePic: "",
    coverPic: "",
    username: "",
    followers: 0,
    following: 0,
    bio: "",
  });
  const {
    data: RawData,
    isLoading: isTweetLoading,
    isFetching: isTweetFetching,
  } = useGetTweetsQuery();
  const TweetDataArray = RawData?.data;
  const { name, profilePic, coverPic, username, followers, following, bio } =
    profileData;
  const token = useAppSelector((state) => state.auth.token);

  const getProfile = async () => {
    try {
      const response = await axiosApi.get(`users/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const profData = response.data.data[0];
      setProfileData(profData);
      setIsLoading(false);
    } catch (err) {
      if ((err as AxiosError).response?.status === 401)
        setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      async () => await axiosApi.get("clearcookie");
      dispatch(logOut());
    }
    getProfile();
  }, []);

  useEffect(() => {
    if (followerModalIsOpen || editProfileModalIsOpen || followingModalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [followerModalIsOpen, editProfileModalIsOpen, followingModalIsOpen]);

  const filterList = {
    1: "Tweets",
    2: "Tweets & Replies",
    3: "Media",
    4: "Likes",
  };

  return isLoading ? (
    <FullScreenLoader />
  ) : (
    <>
      {!editProfileModalIsOpen && <Toaster />}
      {coverPic !== undefined && (
        // <BannerWrapper>
        <Image
          src={coverPic}
          className="banner-image"
          alt="banner"
          layout="responsive"
          width={100}
          height={width! > 880 ? 15 : 45}
        />
        /* </BannerWrapper> */
      )}
      <ProfileBox
        setFollowerModalIsOpen={setFollowerModalIsOpen}
        followerModalIsOpen={followerModalIsOpen}
        setEditProfileModalIsOpen={setEditProfileModalIsOpen}
        editProfileModalIsOpen={editProfileModalIsOpen}
        name={name}
        profilePic={profilePic}
        username={username}
        followers={followers}
        following={following}
        bio={bio}
      />
      <CustomModal
        setModalIsOpen={setFollowerModalIsOpen}
        modalIsOpen={followerModalIsOpen}
        name={name}
        username={username}
        followers={followers}
        following={following}
        modalTitle={`${name} is Following`}
      >
        <FollowerInfo />
      </CustomModal>
      <CustomModal
        setModalIsOpen={setEditProfileModalIsOpen}
        modalIsOpen={editProfileModalIsOpen}
        modalTitle={"Edit Profile"}
        shouldCloseOnOverlayClick={false}
        closeIconOnClick={() => {
          toast.dismiss();
          toast(
            (t) => (
              <span>
                <ToastMessage>Discard changes?</ToastMessage>
                <SubToastMessage>
                  This can’t be undone and you’ll lose your changes.
                </SubToastMessage>
                <DiscardButton
                  onClick={() => {
                    toast.dismiss(t.id);
                    setEditProfileModalIsOpen(false);
                  }}
                >
                  Discard
                </DiscardButton>
                <CancelButton onClick={() => toast.dismiss(t.id)}>
                  Cancel
                </CancelButton>
              </span>
            ),
            {
              duration: Infinity,
              position: "top-right",
            }
          );
        }}
      >
        <Toaster />
        <EditProfile
          coverPic={coverPic}
          profilePic={profilePic}
          name={name}
          username={username}
          bio={bio}
          setEditProfileModalIsOpen={setEditProfileModalIsOpen}
          setProfileData={setProfileData}
        />
      </CustomModal>
      <ContentContainer>
        <FilterBox filterList={filterList} />
        <div>
          {TweetDataArray?.length === 0 ? (
            <NoTweetsToShow />
          ) : (
            TweetDataArray?.map((tweet) =>
              !TweetDataArray ? (
                <></>
              ) : (
                // <TweetWrapper> Add loader or skeleton
                //   <TweetBox>
                //     <Skeleton count={5} />
                //   </TweetBox>
                // </TweetWrapper>
                <Tweet
                  key={tweet._id}
                  authorName={tweet.creator[0].name}
                  authorUserName={tweet.creator[0].username}
                  authorFollowers={6969} //Change
                  authorProfilePic={tweet.creator[0].profilePic}
                  mediaList={tweet.media}
                  authorTweet={tweet.tweet}
                  tweetId={tweet._id}
                  tweetCreationDate={tweet.createdAt}
                />
              )
            )
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default Profile;

const BannerWrapper = styled.div`
  max-width: 120rem;
  margin-inline: auto;
`;

const ContentContainer = styled.div`
  width: min(95%, 102.4rem);
  margin-inline: auto;
  padding-block: 2rem;

  @media screen and (min-width: 40em) {
    display: grid;
    grid-template-columns: 25rem auto;
    gap: 2rem;
  }
`;
