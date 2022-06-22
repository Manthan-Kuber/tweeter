import { AiFillCaretDown } from "react-icons/ai";
import styled, { css } from "styled-components";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../Hooks/store";
import { useUsersQuery } from "../../app/services/api";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const name = useAppSelector((state) => state.auth.user?.name);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { data } = useUsersQuery(userId!);
  return (
    <ProfileContainer>
      {data?.data[0].profilePic !== undefined && (
        <ProfilePic
          src={data?.data[0].profilePic}
          alt={`${name}'s Profile Pic`}
          width={42}
          height={37}
        />
      )}
      <h4>{name}</h4>
      <DropDownIcon
        className="dropdownIcon"
        size={16}
        onClick={() => setVisible(!visible)}
        $visible={visible}
      />
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

const DropDownIcon = styled(AiFillCaretDown)<{ $visible?: boolean }>`
  transition: transform 0.25s;

  ${(props) =>
    props.$visible &&
    css`
      transform: rotate(180deg);
    `}
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

  .dropdownIcon {
    cursor: pointer;
  }
`;
