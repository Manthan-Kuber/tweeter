import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { GrGroup } from "react-icons/gr";
import { MdLogout } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { motion } from "framer-motion";

const ProfileOptionsList = [
  { id: 1, icon: <CgProfile size={16} />, name: "My Profile" },
  { id: 2, icon: <GrGroup size={16} />, name: "Group Chat" },
  { id: 3, icon: <IoMdSettings size={16} />, name: "Settings" },
  { id: 4, icon: <MdLogout size={16} />, name: "Logout" },
];

const variant = {
  initial: { opacity: 0, x: -8, y: -8 },
  animate: { opacity: 1, x: 0, y: 0 },
};

function ProfileDropdown() {
  return (
    <Container
      as={motion.div}
      variants={variant}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      {ProfileOptionsList.map((option) => (
        <>
          <div key={option.id}>
            {option.icon}
            <h4>{option.name}</h4>
          </div>
          {option.id === 3 && <hr />}
        </>
      ))}
    </Container>
  );
}
export default ProfileDropdown;

const Container = styled.div`
  position: absolute;
  bottom: -27rem;
  background-color: white;
  padding: 1.5rem 1.3rem;
  box-shadow: 0px 2px 4px 0px #0000000d;
  border-radius: 12px;
  font-family: var(--ff-noto);

  hr {
    margin-block: 1rem;
  }

  & > div {
    border-radius: 8px;
    padding: 1.5rem 1.3rem;
    display: grid;
    grid-template-columns: 1fr 9fr;
    place-items: center;
    color: #4f4f4f;
    cursor: pointer;

    &:last-child {
      color: red;
    }

    &:hover {
      background-color: #f2f2f2;
    }
  }
`;
