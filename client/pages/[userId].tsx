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
import FullScreenLoader, {
  Loader,
} from "../Components/Common/FullScreenLoader";
import toast, { Toaster } from "react-hot-toast";
import {
  CancelButton,
  DiscardButton,
  SubToastMessage,
  ToastMessage,
} from "../styles/Toast.styles";
import EditProfile from "../Components/Common/EditProfile";
import {
  api,
  useGetProfileTweetsQuery,
  useLazyGetFollowersQuery,
  useLazyGetFollowingQuery,
  useLazyGetProfileTweetsQuery,
} from "../app/services/api";
import NoTweetsToShow from "../Components/Common/NoTweetsToShow";
import Tweet, { TweetBox } from "../Components/Common/Tweet";
import InfiniteScroll from "react-infinite-scroll-component";
import { GetStaticPaths, GetStaticProps } from "next";

var tweetLimit = 10;

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
    bio: "",
  });
  const { data: TweetsData } = useGetProfileTweetsQuery(
    { userId, skip: 0 },
    {
      refetchOnMountOrArgChange: true,
    }
  ); //Resets api cache on mount
  const { name, profilePic, coverPic, username, followers, following, bio } =
    profileData;
  const token = useAppSelector((state) => state.auth.token);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [GetProfileTweetsTrigger] = useLazyGetProfileTweetsQuery();
  const [GetFollowersTrigger, { data: GetFollowersData }] =
    useLazyGetFollowersQuery();
  const [GetFollowingTrigger, { data: GetFollowingData }] =
    useLazyGetFollowingQuery();
  

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
  }, [userId]);

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
      >
        {GetFollowersData !== undefined && (
          <FollowerInfo RawData={GetFollowersData} />
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
      >
        {GetFollowingData !== undefined && (
          <FollowerInfo RawData={GetFollowingData} />
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
          {TweetsData !== undefined && (
            <InfiniteScroll
              dataLength={TweetsData.data.length}
              next={getMoreTweets}
              hasMore={hasMoreTweets}
              loader={<ScrollerMessage>Loading...</ScrollerMessage>}
              endMessage={
                <ScrollerMessage>You have reached the end...</ScrollerMessage>
              }
            >
              {TweetsData.data.length === 0 ? (
                <NoTweetsToShow message="No Tweets To Show !" />
              ) : (
                TweetsData.data
                  .filter((tweet) => tweet.media.length !== 0)
                  .map((tweet) =>
                    !TweetsData.data ? (
                      <Loader size={32} color={"var(--clr-primary)"} />
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
                        isSaved={tweet.saved.length === 0 ? false : true}
                        isLiked={tweet.liked.length === 0 ? false : true}
                        isRetweeted={
                          tweet.retweeted.length === 0 ? false : true
                        }
                        commentCount={tweet.commentCount[0]}
                        likes={tweet.likes}
                        retweetedUsers={tweet.retweetedUsers}
                        savedBy={tweet.savedBy}
                      />
                    )
                  )
              )}
            </InfiniteScroll>
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
    fallback: "blocking",
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

const BannerWrapper = styled.div`
  max-width: 120rem;
  margin-inline: auto;
`;

const PlaceholderTweetBox = styled(TweetBox)`
  margin-bottom: 1rem;
  display: grid;
  place-items: center;
  height: 450px;
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

export const ScrollerMessage = styled.p`
  font: 600 1.4rem var(--ff-noto);
  color: #4f4f4f;
`;
