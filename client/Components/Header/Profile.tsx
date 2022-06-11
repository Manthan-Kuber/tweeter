import { AiFillCaretDown } from "react-icons/ai";
import styled, { css } from "styled-components";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  return (
    <ProfileContainer>
      <ProfilePic
        src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
        width={42}
        height={37}
      />
      <h4>Marco Turser</h4>
      <DropDownIcon
        className="dropdownIcon"
        size={16}
        onClick={() => setVisible(!visible)}
        $visible={visible}
      />
      <AnimatePresence>{visible && <ProfileDropdown />}</AnimatePresence>
    </ProfileContainer>
  );
};
export default Profile;

const ProfilePic = styled(Image)`
  border-radius: 12px;
  border: 1px solid red;
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

  font: 700 1.2rem var(--ff-noto);
  color: #333;

  .dropdownIcon {
    cursor: pointer;
  }
`;
