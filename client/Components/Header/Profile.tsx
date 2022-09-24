import styled from "styled-components";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import { BsThreeDotsVertical } from "react-icons/bs";
import axiosApi from "../../app/services/axiosApi";
import { setProfilePic } from "../../features/auth/authSlice";
import useWindowSize from "../../Hooks/useWindowDimensions";
import OutsideClickHandler from "react-outside-click-handler";
import { BlurImage } from "../Common/Tweet";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const name = useAppSelector((state) => state.auth.user?.name);
  const profilePic = useAppSelector((state) => state.auth.user?.profilePic);
  const token = useAppSelector((state) => state.auth.token);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();
  const { width: WindowWidth } = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await axiosApi.get(`users/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const pfp: string = response.data.data[0].profilePic;
      dispatch(setProfilePic(pfp));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProfileContainer>
      {profilePic !== undefined && (
        <ImageWrapper>
          <ProfilePic
            src={profilePic}
            alt={`${name}'s Profile Pic`}
            width={42}
            height={37}
            isLoading={isLoading}
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
        </ImageWrapper>
      )}
      {WindowWidth! > 880 && <h4>{name}</h4>}
      <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
        <DropDownIconWrapper
          visible={visible}
          onClick={() => setVisible(!visible)}
        >
          <BsThreeDotsVertical className="dropdownIcon" size={20} />
        </DropDownIconWrapper>
        <AnimatePresence>
          {visible && <ProfileDropdown setVisible={setVisible} />}
        </AnimatePresence>
      </OutsideClickHandler>
    </ProfileContainer>
  );
};
export default Profile;

const ProfilePic = styled(BlurImage)`
  border-radius: 6px;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden; //During blur filter transition
  border-radius: 6px;
`;

const DropDownIconWrapper = styled.div<{ visible: boolean }>`
  border-radius: 100%;
  cursor: pointer;
  padding: 8px;
  margin-left: -6px;
  transition: all 0.4s;
  background-color: ${({ visible }) => visible && "rgba(130, 130, 130, 0.2)"};
  &:hover {
    background-color: rgba(130, 130, 130, 0.2);
  }
  &:active {
    background-color: rgba(130, 130, 130, 0.7);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  position: relative;
  color: #333;

  & > h4 {
    font: 700 1.4rem var(--ff-noto);
  }
`;
