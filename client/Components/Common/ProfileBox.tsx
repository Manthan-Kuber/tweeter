import { BsFillPersonPlusFill } from "react-icons/bs";
import { Button } from "../../styles/registerPage.styles";
import { motion } from "framer-motion";
import { useAppSelector } from "../../Hooks/store";
import styled from "styled-components";
import Image from "next/image";
import useWindowSize from "../../Hooks/useWindowDimensions";

const ProfileBox = ({ setModalIsOpen, modalIsOpen }: ModalProps) => {
  const name = useAppSelector((state) => state.auth.user?.name);
  const { width } = useWindowSize();

  return (
    <ProfileContainer>
      <ProfileImageWrapper>
        <ProfileImage
          src={
            "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
          }
          alt="profilePic"
          width={width! > 880 ? 160 : 120}
          height={width! > 880 ? 160 : 120}
        />
      </ProfileImageWrapper>
      <ContentWrapper>
        <ProfileWrapper>
          <InfoWrapper>
            <h3>{name}</h3>
            <FollowerContainer>
              <span onClick={() => setModalIsOpen(true)}>
                <span>4200</span> Following
              </span>
              <span onClick={() => setModalIsOpen(true)}>
                <span>6969</span> Followers
              </span>
            </FollowerContainer>
          </InfoWrapper>
          <p>
            Kim Jong Un Stunt Double | #HustleMax | #UdaDunga | It is a long
            established fact that a reader will be distracted by the readable
            content of a page when looking at its layout. The point of using
            Lorem Ipsum is that it has a more-or-less normal distribution of
            letters, as opposed to using 'Content here, content here', making it
            look like readable English. (injected humour and the like)
          </p>
        </ProfileWrapper>
        <FollowButton as={motion.button} whileTap={{ scale: 0.9 }}>
          <BsFillPersonPlusFill />
          Follow
        </FollowButton>
      </ContentWrapper>
    </ProfileContainer>
  );
};
export default ProfileBox;

const ProfileContainer = styled.div`
  width: min(95%, 102.4rem);
  background-color: white;
  padding-block: 2.5rem;
  font-family: var(--ff-poppins);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-inline: auto;
  margin-top: -10%;
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
    margin-top: -5%;
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

const ProfileImage = styled(Image)`
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

const FollowButton = styled(Button)`
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
  @media screen and (min-width: 55em) {
    & > p {
      font-size: 1.4rem;
      margin-top: revert;
    }
  }
`;
