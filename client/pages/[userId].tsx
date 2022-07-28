import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FilterBox from "../Components/Common/FilterBox";
import Image from "next/image";
import useWindowSize from "../Hooks/useWindowDimensions";
import ProfileBox from "../Components/Common/ProfileBox";
import CustomModal from "../Components/Common/CustomModal";
import Tweet from "../Components/Common/Tweet";
import FollowerInfo from "../Components/Common/FollowerInfo";
import axiosApi from "../app/services/axiosApi";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../Hooks/store";
import { logOut } from "../features/auth/authSlice";
import FullScreenLoader from "../Components/Common/FullScreenLoader";
import toast, { Toaster } from "react-hot-toast";
import { ToastMessage } from "../styles/Toast.styles";
import EditProfile from "../Components/Common/EditProfile";
import { TweetButton } from "../Components/Common/CreateTweet";
import { useGetTweetsQuery } from "../app/services/api";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [followerModalIsOpen, setFollowerModalIsOpen] = useState(false);
  const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false);
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const { width } = useWindowSize();
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
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
  const { data: RawData, isSuccess } = useGetTweetsQuery();
  const TweetDataArray = RawData?.data;
  const { name, profilePic, coverPic, username, followers, following, bio } =
    profileData;

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
  }, []);

  const token = useAppSelector((state) => state.auth.token);

  const requestConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const createComment = async (formData: FormData) => {
    try {
      const response = await axiosApi.post("/comment", formData, requestConfig);
      console.log(response);
      toast.success(() => (
        <ToastMessage>Created Reply Successfully</ToastMessage>
      ));
    } catch (error) {
      toast.error(() => (
        <ToastMessage>
          Error in creating Reply: <br /> {(error as AxiosError).message}
        </ToastMessage>
      ));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileArray = fileList.map((item) => item.file);
    console.log(fileArray);
    console.log(message);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("comment", message);
    //Replace value with tweetId later
    formData.append("tweetId", "62b6feba6c514dd62f3ac6d0");
    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileArray[i]);
      console.log(fileArray[i]);
    }
    createComment(formData);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      async () => await axiosApi.get("clearcookie");
      dispatch(logOut());
    }
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
        closeIconOnClick={() =>
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
          )
        }
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
       {TweetDataArray?.map((tweet,index) => (
         <Tweet
         key={`${tweet.creator[0].username} ${index}`}
         message={message}
         setMessage={setMessage}
         fileList={fileList}
         setFileList={setFileList}
         onSubmit={onSubmit}
         authorName={tweet.creator[0].name}
         authorUserName={tweet.creator[0].username}
         authorFollowers={6969}
         authorProfilePic={tweet.creator[0].profilePic}
         mediaList={tweet.media}
         authorTweet={tweet.tweet}
       />
       ))}
      </ContentContainer>
    </>
  );
};

export default Profile;

const BannerWrapper = styled.div`
  max-width: 120rem;
  margin-inline: auto;
`;

const SubToastMessage = styled(ToastMessage)`
  color: hsla(0, 0%, 31%, 0.7);
`;

const DiscardButton = styled(TweetButton)`
  background-color: rgba(255, 0, 0, 1);
  margin-top: 1rem;
  border-radius: 8px;
  &:hover {
    background-color: rgba(255, 0, 0, 0.7);
  }
`;
const CancelButton = styled(DiscardButton)`
  background-color: white;
  border: 1px solid black;
  margin-left: 1rem;
  color: black;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

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
