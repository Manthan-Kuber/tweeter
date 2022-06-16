import Modal from "react-modal";
import styled from "styled-components";
import { useAppSelector } from "../../Hooks/store";
import { GrClose } from "react-icons/gr";
import { FollowButton } from "./ProfileBox";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Image from "next/image";
import { motion } from "framer-motion";

Modal.setAppElement("#__next");

const CustomModal = ({ setModalIsOpen, modalIsOpen }: ModalProps) => {
  const name = useAppSelector((state) => state.auth.user?.name);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Followers & Following Modal"
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        content: {
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(95% , 60rem)",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "8px",
          outline: "none",
          maxHeight: "64rem",
          padding: "2rem",
        },
      }}
    >
      <MainWrapper>
        <CloseIconDivWrapper>
          <span>{`${name} is following`}</span>
          <CloseIcon onClick={() => setModalIsOpen(false)} />
        </CloseIconDivWrapper>
        <hr />
        {Array.from(Array(10).keys()).map((index, item) => (
          <>
            <ProfileElementWrapper key={index}>
              <div>
                <ProfileInfoWrapper>
                  <ProfilePic
                    src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
                    width={42}
                    height={37}
                  />
                  <div>
                    <span>Austin Neil</span>
                    <span>12k Followers</span>
                  </div>
                </ProfileInfoWrapper>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  eu erat eu ipsum placerat gravida. Duis nec nisl eget enim
                  facilisis rhoncus ac sit amet turpis. Maecenas fermentum quis
                  nulla consequat lobortis. Cras et elit at quam ornare
                  efficitur. Aliquam erat volutpat. In leo lorem, rhoncus sed
                  fermentum a, feugiat non metus. Vivamus cursus aliquet metus.
                </p>
              </div>
              <StyledFollowButton as={motion.button} whileTap={{ scale: 0.9 }}>
                <BsFillPersonPlusFill />
                Follow
              </StyledFollowButton>
            </ProfileElementWrapper>
            <hr />
          </>
        ))}
      </MainWrapper>
    </Modal>
  );
};
export default CustomModal;

const MainWrapper = styled.div`
  font: 600 1.4rem var(--ff-poppins);

  hr {
    border-color: hsla(0, 0%, 88%, 1);
    border-width: 1px;
  }
`;

const CloseIcon = styled(GrClose)`
  cursor: pointer;
  font-size: 1.4rem;
`;

const CloseIconDivWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ProfileElementWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div p {
    margin-top: 2rem;
    color: hsla(0, 0%, 51%, 1);
    font-weight: 500;
  }
`;
const StyledFollowButton = styled(FollowButton)`
  margin-inline: revert;
  padding: 1rem 2rem;
  float: right;
  margin-top: revert;
  font-size: 1.4rem;
  align-self: flex-start;
`;

const ProfilePic = styled(Image)`
  border-radius: 6px;
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  gap: 2rem;
  span {
    display: block;
  }
  span + span {
    color: hsla(0, 0%, 51%, 1);
    font-size: 1.2rem;
  }
`;
