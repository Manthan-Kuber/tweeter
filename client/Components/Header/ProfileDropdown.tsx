import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { GrGroup } from "react-icons/gr";
import { MdLogout } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../Hooks/store";
import { logOut } from "../../features/auth/authSlice";

const variant = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.69,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.25,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.25,
    },
  },
};

function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const ProfileOptionsList = [
    {
      id: 1,
      icon: <CgProfile size={16} />,
      name: "My Profile",
      onClick: () => {},
    },
    {
      id: 2,
      icon: <GrGroup size={16} />,
      name: "Group Chat",
      onClick: () => {},
    },
    {
      id: 3,
      icon: <IoMdSettings size={16} />,
      name: "Settings",
      onClick: () => {},
    },
    {
      id: 4,
      icon: <MdLogout size={16} />,
      name: "Logout",
      onClick: () => {
        dispatch(logOut());
      },
    },
  ];
  return (
    <Container
      as={motion.div}
      variants={variant}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      {ProfileOptionsList.map((option) => (
        <OptionWrapper key={option.id}>
          <div onClick={option.onClick}>
            {option.icon}
            <h4>{option.name}</h4>
          </div>
          {option.id === 3 && <hr />}
        </OptionWrapper>
      ))}
    </Container>
  );
}
export default ProfileDropdown;

const Container = styled.div`
  position: absolute;
  bottom: -26rem;
  right: -0.6rem;
  background-color: white;
  padding: 1.5rem 1.3rem;
  box-shadow: 0 4px 12px -1px rgb(0 0 0 / 0.1), 0 2px 8px -2px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  white-space: nowrap;
  min-width: 17rem;

  & > div:last-child > div {
    color: red;
  }
`;

const OptionWrapper = styled.div`
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

    &:hover {
      background-color: #f2f2f2;
    }
  }
`;
