import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../../hooks/useWindowDimensions";
import ProfileBox from "../../Components/Common/ProfileBox";
import CustomModal from "../../Components/Common/CustomModal";
import FollowerInfo from "../../Components/Common/FollowerInfo";
import axiosApi from "../../app/services/axiosApi";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { logOut } from "../../features/auth/authSlice";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import toast, { Toaster } from "react-hot-toast";
import {
  CancelButton,
  DiscardButton,
  SubToastMessage,
  ToastMessage,
} from "../../styles/Toast.styles";
import EditProfile from "../../Components/Common/EditProfile";
import {
  api,
  useGetProfileTweetsLikesQuery,
  useGetProfileTweetsQuery,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery,
  useLazyGetProfileTweetsAndRepliesQuery,
  useLazyGetProfileTweetsLikesQuery,
  useLazyGetProfileTweetsMediaQuery,
  useLazyGetProfileTweetsQuery,
} from "../../app/services/api";
import { TweetBox } from "../../Components/Common/Tweet";
import { GetStaticPaths, GetStaticProps } from "next";
import TweetsDataList from "../../Components/Common/TweetsDataList";
import ScrollToTopButton from "../../Components/Common/ScrollToTopButton";
import { useRouter } from "next/router";

const Profile = ({ userId }: { userId: string }) => {
  const dispatch = useAppDispatch();
  const [followerModalIsOpen, setFollowerModalIsOpen] = useState(false);
  const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false);
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const { width } = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    profilePic: "",
    coverPic: "",
    username: "",
    followers: 0,
    following: 0,
    followed: false,
    bio: "",
  });
  const { data: TweetsData } = useGetProfileTweetsQuery(
    { userId, skip: 0 }
    // { refetchOnMountOrArgChange: true }
  ); //Resets api cache on mount
  const { data: TweetsLikesData } = useGetProfileTweetsLikesQuery({
    userId,
    skip: 0,
  });
  const {
    name,
    profilePic,
    coverPic,
    username,
    followers,
    following,
    bio,
    followed,
  } = profileData;
  const token = useAppSelector((state) => state.auth.token);
  const [GetFollowersTrigger, { data: GetFollowersData }] =
    useLazyGetFollowersQuery();
  const [GetFollowingTrigger, { data: GetFollowingData }] =
    useLazyGetFollowingQuery();
  const [GetProfileTweetsTrigger] = useLazyGetProfileTweetsQuery();
  const [GetProfileTweetsAndRepliesTrigger] =
    useLazyGetProfileTweetsAndRepliesQuery();
  const [GetProfileTweetsMediaTrigger] = useLazyGetProfileTweetsMediaQuery();
  const [GetProfileTweetsLikesTrigger] = useLazyGetProfileTweetsLikesQuery();
  const [tab, setTab] = useState(0);
  const [hasMoreTweets, setHasMoreTweets] = useState(false);
  const { width: WindowWidth } = useWindowSize();
  const { isFallback } = useRouter();

  var tweetLimit = 10;

  const filterList = [
    {
      id: 0,
      label: "Tweets",
    },
    {
      id: 1,
      label: "Tweets & Replies",
    },
    {
      id: 2,
      label: "Media",
    },
    {
      id: 3,
      label: "Likes",
    },
  ];

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
    getProfile();
  }, [userId, GetFollowingData, GetFollowersData]);

  const getMoreTweets = async () => {
    try {
      if (TweetsData !== undefined) {
        if (TweetsData.data.length < tweetLimit) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsTrigger({
            userId,
            skip: TweetsData.data.length / tweetLimit,
          }).unwrap();
          if (newTweetData.length < TweetsData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getProfileTweets",
              { userId, skip: 0 },
              (tweetData) => {
                newTweetData.map((newTweet) => tweetData.data.push(newTweet));
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

  const getMoreTweetsLikes = async () => {
    try {
      if (TweetsLikesData !== undefined) {
        if (TweetsLikesData.data.length < tweetLimit) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsLikesTrigger({
            userId,
            skip: TweetsLikesData.data.length / tweetLimit,
          }).unwrap();
          if (newTweetData.length < TweetsLikesData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getProfileTweetsLikes",
              { userId, skip: 0 },
              (tweetData) => {
                newTweetData.map((newTweet) => {
                  tweetData.data.push(newTweet);
                });
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

  return isFallback || isLoading ? (
    <FullScreenLoader />
  ) : (
    <>
      <ScrollToTopButton />
      {!editProfileModalIsOpen && <Toaster />}
      {coverPic !== undefined && WindowWidth !== undefined && (
        <BannerWrapper>
          <StyledImage
            src={coverPic}
            className="banner-image"
            alt="banner"
            layout="fill"
            priority
            objectFit={WindowWidth < 880 ? "contain" : undefined}
          />
        </BannerWrapper>
      )}
      <ProfileBox
        followerModalIsOpen={followerModalIsOpen}
        setFollowerModalIsOpen={setFollowerModalIsOpen}
        followingModalIsOpen={followingModalIsOpen}
        setFollowingModalIsOpen={setFollowingModalIsOpen}
        setEditProfileModalIsOpen={setEditProfileModalIsOpen}
        editProfileModalIsOpen={editProfileModalIsOpen}
        name={name}
        profilePic={profilePic}
        username={username}
        followers={followers}
        following={following}
        bio={bio}
        GetFollowersTrigger={GetFollowersTrigger}
        GetFollowingTrigger={GetFollowingTrigger}
        isFollowing={followed}
        userId={userId}
        getProfile={getProfile}
      />
      {/* Extact into a separate component */}
      <CustomModal
        setModalIsOpen={setFollowerModalIsOpen}
        modalIsOpen={followerModalIsOpen}
        name={name}
        username={username}
        followers={followers}
        following={following}
        modalTitle={`${name} is Followed By`}
        shouldCloseOnOverlayClick={true}
      >
        {GetFollowersData !== undefined && (
          <FollowerInfo
            RawData={GetFollowersData}
            setModalIsOpen={setFollowerModalIsOpen} //Remove if not needed
          />
        )}
      </CustomModal>
      <CustomModal
        setModalIsOpen={setFollowingModalIsOpen}
        modalIsOpen={followingModalIsOpen}
        name={name}
        username={username}
        followers={followers}
        following={following}
        modalTitle={`${name} is Following`}
        shouldCloseOnOverlayClick={true}
      >
        {GetFollowingData !== undefined && (
          <FollowerInfo
            RawData={GetFollowingData}
            setModalIsOpen={setFollowingModalIsOpen} //Remove if not needed
          />
        )}
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
                  This cannot be undone and you will lose your changes.
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
        <FilterBox filterList={filterList} tab={tab} setTab={setTab} />
        <div>
          {tab === 0 ? (
            TweetsData !== undefined && (
              <TweetsDataList
                TweetsData={TweetsData}
                getMoreTweets={getMoreTweets}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            )
          ) : tab === 1 ? (
            <p>Replies {tab}</p>
          ) : tab === 2 ? (
            <p>Media {tab}</p>
          ) : (
            TweetsLikesData !== undefined && (
              <TweetsDataList
                TweetsData={TweetsLikesData}
                getMoreTweets={getMoreTweetsLikes}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            )
          )}
        </div>
      </ContentContainer>
    </>
  );
};

export default Profile;

export const getStaticPaths: GetStaticPaths = (context) => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  if (context.params !== undefined) {
    const userId = context.params.userId;
    return {
      props: {
        userId,
      },
    };
  }
  return {
    props: {},
  };
};

const StyledImage = styled(Image)`
  border-radius: 8px;
`;

const BannerWrapper = styled.div`
  position: relative;
  width: min(95%, 120rem);
  margin-inline: auto;
  height: 25rem;
  border-radius: 8px;
  border: 1px solid lightgray;

  @media screen and (min-width: 50em) {
    border: revert;
    height: 30rem;
  }
`;

const PlaceholderTweetBox = styled(TweetBox)`
  margin-bottom: 1rem;
  display: grid;
  place-items: center;
  height: 450px;
`;

const ContentContainer = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;

  @media screen and (min-width: 40em) {
    display: grid;
    grid-template-columns: 25rem auto;
    gap: 2rem;
  }
`;

export const ScrollerMessage = styled.p`
  font: 600 1.4rem var(--ff-noto);
  color: #4f4f4f;
`;