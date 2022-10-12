import { BsFillPersonPlusFill } from "react-icons/bs";
import { Button } from "../../styles/registerPage.styles";
import { motion } from "framer-motion";
import styled from "styled-components";
import useWindowSize from "../../Hooks/useWindowDimensions";
import { useAppSelector } from "../../Hooks/store";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { ToastMessage } from "../../styles/Toast.styles";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/api";
import toast from "react-hot-toast";
import { BlurImage } from "./Tweet";

const ProfileBox = ({
  setFollowerModalIsOpen,
  setFollowingModalIsOpen,
  setEditProfileModalIsOpen,
  editProfileModalIsOpen,
  followerModalIsOpen,
  name,
  username,
  bio,
  profilePic,
  isFollowing,
  userId,
  getProfile,
  ...props
}: ProfileBoxProps) => {
  const { width } = useWindowSize();
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleFollow = async () => {
    try {
      await followUser(userId).unwrap();
      toast.success(() => (
        <ToastMessage>Followed User Successfully</ToastMessage>
      ));
      getProfile();
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Following User</ToastMessage>);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId).unwrap();
      toast.success(() => (
        <ToastMessage>Unfollowed User Successfully</ToastMessage>
      ));
      getProfile();
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Unfollowing User</ToastMessage>);
    }
  };

  return (
    <ProfileContainer>
      <ProfileImageWrapper>
        {profilePic !== undefined && (
          <ProfileImage
            src={profilePic}
            alt="profilePic"
            priority
            width={width! > 880 ? 160 : 120}
            height={width! > 880 ? 160 : 120}
            isLoading={isLoading}
            onLoadingComplete={() => setIsLoading(false)}
          />
        )}
      </ProfileImageWrapper>
      <ContentWrapper>
        <ProfileWrapper>
          <InfoWrapper>
            <h3>{name}</h3>
            <FollowerContainer>
              <span
                onClick={async () => {
                  try {
                    setFollowingModalIsOpen(true);
                    await props.GetFollowingTrigger(userId).unwrap();
                  } catch (err) {
                    <ToastMessage> Error in Fetching Following </ToastMessage>;
                  }
                }}
              >
                <span>{props.following}</span> Following
              </span>
              <span
                onClick={async () => {
                  try {
                    setFollowerModalIsOpen(true);
                    await props.GetFollowersTrigger(userId).unwrap();
                  } catch (err) {
                    <ToastMessage> Error in Fetching Followers </ToastMessage>;
                  }
                }}
              >
                <span>{props.followers}</span> Followers
              </span>
            </FollowerContainer>
          </InfoWrapper>
          <h4>{`@ ${username}`}</h4>
          <p>{`${bio}`}</p>
        </ProfileWrapper>
        {userId === currentUserId ? (
          <EditProfileButton
            as={motion.button}
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditProfileModalIsOpen(true)}
            disabled={!(userId === currentUserId)}
          >
            <MdEdit />
            Edit Profile
          </EditProfileButton>
        ) : (
          <FollowButton
            as={motion.button}
            whileTap={{ scale: 0.9 }}
            disabled={userId === currentUserId}
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            <BsFillPersonPlusFill />
            {isFollowing ? "Unfollow" : "Follow"}
          </FollowButton>
        )}
      </ContentWrapper>
    </ProfileContainer>
  );
};
export default ProfileBox;

const EditProfileButton = styled(Button)`
  width: revert;
  padding: 0.75rem 1.5rem;
  margin-top: revert;
  height: fit-content;
  color: var(--clr-primary);
  border: 1px solid var(--clr-primary);
  background-color: white;
  margin-top: 2rem;
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  white-space: nowrap;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  @media screen and (min-width: 55em) {
    margin: revert;
    height: fit-content;
  }
`;

const ProfileContainer = styled.div`
  width: min(95%, 120rem);
  background-color: white;
  padding-block: 2.5rem;
  font-family: var(--ff-poppins);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 0 0 6px 6px;
  margin-inline: auto;
  margin-top: 0%;
  position: relative;
  padding-inline: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: hsla(0, 0%, 20%, 1);

  @media screen and (min-width: 55em) {
    text-align: revert;
    flex-direction: row;
    margin-top: 0%;
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  margin-top: -10rem;
  width: fit-content;
  margin-inline: auto;
  height: fit-content;
  padding: 4px 4px 0 4px;
  border-radius: 8px;
  background-color: white;

  @media screen and (min-width: 55em) {
    margin-inline: revert;
    margin-top: -7rem;
  }
`;

const ProfileImage = styled(BlurImage)`
  border-radius: 8px;
`;

const InfoWrapper = styled.div`
  h3 {
    font-size: clamp(2.4rem, 2.5vw + 1rem, 2.8rem);
  }
  @media screen and (min-width: 55em) {
    display: flex;
    gap: 3rem;
    align-items: center;
    width: 100%;
  }
`;
const FollowerContainer = styled.div`
  width: 100%;
  font-size: clamp(1.2rem, 1vw + 1rem, 1.4rem);

  & > span {
    margin-inline: 1rem;
    color: hsla(0, 0%, 51%, 1);
    cursor: pointer;

    span {
      font-weight: 600;
      color: hsla(0, 0%, 20%, 1);
    }
  }

  & > span:hover {
    text-decoration: underline;
  }

  @media screen and (min-width: 55em) {
    width: fit-content;
  }
`;

export const FollowButton = styled(Button)`
  width: fit-content;
  margin-inline: auto;
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 6px;
  line-height: 14px;
  font-weight: 500;

  @media screen and (min-width: 55em) {
    margin: revert;
    padding: 1rem 2rem;
    height: fit-content;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  @media screen and (min-width: 55em) {
    display: flex;
    justify-content: space-between;
  }
`;

const ProfileWrapper = styled.div`
  & > p {
    font: 500 1.8rem var(--ff-noto);
    color: hsla(0, 0%, 51%, 1);
    margin-top: 2rem;
  }
  & > h4 {
    font-size: clamp(1.2rem, 1vw + 0.5rem, 1.4rem);
    color: hsla(0, 0%, 51%, 1);
  }
  @media screen and (min-width: 55em) {
    & > p {
      font-size: 1.4rem;
      margin-top: revert;
    }
  }
`;
