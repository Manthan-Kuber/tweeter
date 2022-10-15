import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";
import useWindowSize from "../../Hooks/useWindowDimensions";
import ProfileBox from "../../Components/Common/ProfileBox";
import CustomModal from "../../Components/Common/CustomModal";
import axiosApi from "../../app/services/axiosApi";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
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
  useGetProfileTweetsAndRepliesQuery,
  useGetProfileTweetsLikesQuery,
  useGetProfileTweetsMediaQuery,
  useGetProfileTweetsQuery,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery,
  useLazyGetProfileTweetsAndRepliesQuery,
  useLazyGetProfileTweetsLikesQuery,
  useLazyGetProfileTweetsMediaQuery,
  useLazyGetProfileTweetsQuery,
} from "../../app/services/api";
import { GetStaticPaths, GetStaticProps } from "next";
import TweetsDataList from "../../Components/Common/TweetsDataList";
import ScrollToTopButton from "../../Components/Common/ScrollToTopButton";
import { useRouter } from "next/router";
import ContentLoader from "../../Components/Common/ContentLoader";
import { BlurImage } from "../../Components/Common/Tweet";
import FollowerFollowingModal from "../../Components/Common/FollowerFollowingModal";

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

const Profile = ({ userId }: { userId: string }) => {
  const dispatch = useAppDispatch();
  const [followerModalIsOpen, setFollowerModalIsOpen] = useState(false);
  const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false);
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [tab, setTab] = useState(0);
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
  const { data: TweetsData } = useGetProfileTweetsQuery({ userId, skip: 0 });
  const { data: TweetsAndRepliesData } = useGetProfileTweetsAndRepliesQuery(
    {
      userId,
      skip: 0,
    },
    {
      skip: !(tab === 1),
    }
  );
  const { data: TweetsMediaData } = useGetProfileTweetsMediaQuery(
    {
      userId,
      skip: 0,
    },
    {
      skip: !(tab === 2),
    }
  );
  const { data: TweetsLikesData } = useGetProfileTweetsLikesQuery(
    {
      userId,
      skip: 0,
    },
    {
      skip: !(tab === 3),
    }
  );

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
  const { width: WindowWidth } = useWindowSize();
  const { isFallback } = useRouter();
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false);

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
        if (TweetsData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsTrigger({
            userId,
            skip: TweetsData.data.length / 10,
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
        if (TweetsLikesData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsLikesTrigger({
            userId,
            skip: TweetsLikesData.data.length / 10,
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

  const getMoreTweetsMedia = async () => {
    try {
      if (TweetsMediaData !== undefined) {
        if (TweetsMediaData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } = await GetProfileTweetsMediaTrigger({
            userId,
            skip: TweetsMediaData.data.length / 10,
          }).unwrap();
          if (newTweetData.length < TweetsMediaData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getProfileTweetsMedia",
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

  const getMoreTweetsAndReplies = async () => {
    try {
      if (TweetsAndRepliesData !== undefined) {
        if (TweetsAndRepliesData.data.length < 10) {
          setHasMoreTweets(false);
        } else {
          const { data: newTweetData } =
            await GetProfileTweetsAndRepliesTrigger({
              userId,
              skip: TweetsAndRepliesData.data.length / 10,
            }).unwrap();
          if (newTweetData.length < TweetsAndRepliesData.data.length)
            setHasMoreTweets(false);
          dispatch(
            api.util.updateQueryData(
              "getProfileTweetsAndReplies",
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

  const folModalProps = {
    name: name,
    username: username,
    followers: followers,
    following: following,
    shouldCloseOnOverlayClick: true,
  };

  return isFallback || isLoading ? (
    <FullScreenLoader />
  ) : (
    <>
      <ScrollToTopButton />
      {!editProfileModalIsOpen && <Toaster />}
      <BannerWrapper>
        {coverPic !== undefined && WindowWidth !== undefined && (
          <BannerImage
            src={coverPic}
            className="banner-image"
            alt="banner"
            layout="fill"
            objectFit="cover"
            priority
            isLoading={isBannerLoading}
            onLoadingComplete={() => setIsBannerLoading(false)}
          />
        )}
      </BannerWrapper>
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
      <FollowerFollowingModal
        {...folModalProps}
        setFollowerModalIsOpen={setFollowingModalIsOpen}
        followerModalIsOpen={followingModalIsOpen}
        modalTitle={`${name} is Following`}
        GetFollowersData={GetFollowingData}
      />
      <FollowerFollowingModal
        {...folModalProps}
        setFollowerModalIsOpen={setFollowerModalIsOpen}
        followerModalIsOpen={followerModalIsOpen}
        modalTitle={`${name} is Followed By`}
        GetFollowersData={GetFollowersData}
      />
      <CustomModal
        setModalIsOpen={setEditProfileModalIsOpen}
        modalIsOpen={editProfileModalIsOpen}
        modalTitle={"Edit Profile"}
        shouldCloseOnOverlayClick={false}
        isCloseButtonDisabled={isEditButtonLoading}
        closeIconOnClick={() => {
          if (!isEditButtonLoading) {
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
          }
        }}
      >
        <EditProfile
          coverPic={coverPic}
          profilePic={profilePic}
          name={name}
          username={username}
          bio={bio}
          setEditProfileModalIsOpen={setEditProfileModalIsOpen}
          setProfileData={setProfileData}
          isLoading={isEditButtonLoading}
          setIsLoading={setIsEditButtonLoading}
        />
      </CustomModal>
      <ContentContainer>
        <FilterBox filterList={filterList} tab={tab} setTab={setTab} />
        <div>
          {tab === 0 ? (
            TweetsData !== undefined ? (
              <TweetsDataList
                TweetsData={TweetsData.data}
                getMoreTweets={getMoreTweets}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            ) : (
              <ContentLoader size={36} />
            )
          ) : tab === 1 ? (
            TweetsAndRepliesData !== undefined ? (
              <TweetsDataList
                TweetsData={TweetsAndRepliesData.data}
                getMoreTweets={getMoreTweetsAndReplies}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            ) : (
              <ContentLoader size={36} />
            )
          ) : tab === 2 ? (
            TweetsMediaData !== undefined ? (
              <TweetsDataList
                TweetsData={TweetsMediaData.data}
                getMoreTweets={getMoreTweetsMedia}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            ) : (
              <ContentLoader size={36} />
            )
          ) : (
            tab === 3 &&
            (TweetsLikesData !== undefined ? (
              <TweetsDataList
                TweetsData={TweetsLikesData.data}
                getMoreTweets={getMoreTweetsLikes}
                hasMoreTweets={hasMoreTweets}
                setHasMoreTweets={setHasMoreTweets}
              />
            ) : (
              <ContentLoader size={36} />
            ))
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

const BannerImage = styled(BlurImage)`
  border-radius: 6px 6px 0 0;
`;

const BannerWrapper = styled.div`
  position: relative;
  width: min(95%, 120rem);
  margin-inline: auto;
  aspect-ratio: 16/9;
  border-radius: 6px 6px 0 0;
  border: 1px solid lightgray;
  background-color: white;
  overflow: hidden;

  @media screen and (min-width: 50em) {
    border: revert;
    height: 30rem;
  }
`;

const ContentContainer = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;

  @media screen and (min-width: 50em) {
    display: grid;
    grid-template-columns: 25rem auto;
    gap: 2rem;
  }
`;

export const ScrollerMessage = styled.p`
  font: 600 1.4rem var(--ff-noto);
  color: #4f4f4f;
`;
