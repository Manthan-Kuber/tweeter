import styled from "styled-components";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { HiUserGroup, HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import { logOut } from "../../features/auth/authSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { ToastMessage } from "../../styles/Toast.styles";

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

function ProfileDropdown({ setVisible }: ProfileDropDownProps) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const router = useRouter();
  const { push, replace } = router;
  const ProfileOptionsList = [
    {
      id: 1,
      icon: <MdAccountCircle size={20} />,
      name: "My Profile",
      onClick: async () => {
        setVisible((prev) => !prev);
        push(`/${userId}`);
      },
    },
    {
      id: 2,
      icon: <HiUserGroup size={20} />,
      name: "Group Chat",
      onClick: () => {
        setVisible((prev) => !prev);
      },
    },
    {
      id: 3,
      icon: <IoMdSettings size={20} />,
      name: "Settings",
      onClick: () => {
        setVisible((prev) => !prev);
      },
    },
    {
      id: 4,
      icon: <HiOutlineLogout size={20} />,
      name: "Logout",
      onClick: () => {
        setVisible((prev) => !prev);
        replace("/");
        dispatch(logOut());
        toast.success(
          () => <ToastMessage>Logged Out Successfully</ToastMessage>,
          {
            position: "bottom-center",
          }
        );
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
  bottom: -28rem;
  right: 0;
  background-color: white;
  padding: 1.5rem 1.3rem;
  box-shadow: 0 4px 12px -1px rgb(0 0 0 / 0.1), 0 2px 8px -2px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  white-space: nowrap;
  min-width: 20rem;
  border: 1px solid #f2f2f2;
  z-index: 2;

  & > div:last-child > div {
    color: red;
  }
`;

const OptionWrapper = styled.div`
  hr {
    margin-block: 1rem;
    border-color: #f2f2f2;
    border: 1.5px solid #f2f2f2;
  }

  & > div {
    border-radius: 8px;
    padding: 1.5rem 1.3rem;
    display: grid;
    grid-template-columns: 1fr 9fr;
    gap: 1rem;
    color: #4f4f4f;
    cursor: pointer;

    h4 {
      font: 500 1.4rem var(--ff-montserrat);
    }

    &:hover {
      background-color: #f2f2f2;
    }
  }
`;
