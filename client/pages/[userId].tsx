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
import {
  api,
  useGetTweetsQuery,
  useLazyGetCommentsQuery,
  useLazyGetTweetsQuery,
} from "../app/services/api";
import NoTweetsToShow from "../Components/Common/NoTweetsToShow";
import Tweet from "../Components/Common/Tweet";
import InfiniteScroll from "react-infinite-scroll-component";

var tweetLimit = 10;

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
    data: TweetsData,
    isLoading: isTweetLoading,
    isFetching: isTweetFetching,
  } = useGetTweetsQuery(0,{refetchOnMountOrArgChange:true});
  const { name, profilePic, coverPic, username, followers, following, bio } =
    profileData;
  const token = useAppSelector((state) => state.auth.token);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [trigger] = useLazyGetTweetsQuery();

  const getMoreTweets = async () => {
    try {
      if (TweetsData !== undefined) {
        const { data: newTweetData } = await trigger(
          TweetsData.data.length / 10
        ).unwrap();
        if (newTweetData.length < TweetsData.data.length) setHasMoreTweets(false);
        dispatch(
          api.util.updateQueryData("getTweets", 0, (tweetData) => {
            newTweetData.map((newTweet) => tweetData.data.push(newTweet));
          })
        );
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
          {TweetsData !== undefined && (
            <InfiniteScroll
              dataLength={TweetsData.data.length}
              next={getMoreTweets}
              hasMore={hasMoreTweets}
              loader={<p>Loading...</p>} //Change Later
              endMessage={<p>You've reached the end</p>} //Change Later
            >
              {TweetsData.data.length === 0 ? (
                <NoTweetsToShow />
              ) : (
                TweetsData.data.map((tweet) =>
                  !TweetsData.data ? (
                    <p>Loading</p>
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
            </InfiniteScroll>
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
