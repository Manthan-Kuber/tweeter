import styled, { css } from "styled-components";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../Hooks/store";
import { BsThreeDotsVertical } from "react-icons/bs";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const name = useAppSelector((state) => state.auth.user?.name);
  const profilePic = useAppSelector((state) => state.auth.user.profilePic);

  return (
    <ProfileContainer>
      {profilePic !== undefined && (
        <ProfilePic
          src={profilePic}
          alt={`${name}'s Profile Pic`}
          width={42}
          height={37}
        />
      )}
      <h4>{name}</h4>
      <DropDownIconWrapper visible={visible} onClick={() => setVisible(!visible)}>
        <BsThreeDotsVertical className="dropdownIcon" size={20} />
      </DropDownIconWrapper>
      <AnimatePresence>
        {visible && <ProfileDropdown setVisible={setVisible} />}
      </AnimatePresence>
    </ProfileContainer>
  );
};
export default Profile;

const ProfilePic = styled(Image)`
  border-radius: 6px;
`;

const DropDownIconWrapper = styled.div<{visible:boolean}>`
  border-radius: 100%;
  cursor: pointer;
  padding: 8px;
  margin-left: -6px;
  transition: all 0.4s;
  background-color: ${({visible}) => visible && 'rgba(130, 130, 130, 0.2)' };
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
