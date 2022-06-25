import { motion } from "framer-motion";
import { BsFillPersonPlusFill } from "react-icons/bs";
import styled from "styled-components";
import { AsideContainer } from "./FilterBox";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

const SuggestedFollow = () => {
  return (
    <Article as="article">
      <h5>Whom to follow</h5>
      {/* Map it */}
      {Array.from(Array(10).keys()).map((index) => (
        <FollowerContainer key={index}>
          <hr />
          <ProfileInfoWrapper>
            <ProfileInfo />
            <MoreStyledFollowButton
              as={motion.button}
              whileTap={{ scale: 0.9 }}
            >
              <BsFillPersonPlusFill />
              Follow
            </MoreStyledFollowButton>
          </ProfileInfoWrapper>
          <p>Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰</p>
        </FollowerContainer>
      ))}
    </Article>
  );
};
export default SuggestedFollow;

const Article = styled(AsideContainer)`
  padding: 1rem;
  color: #4f4f4f;
  max-height: 40rem;
  max-width: 30rem;
  overflow-y: scroll;
  h5 {
    margin-bottom: 1rem;
  }
`;

const FollowerContainer = styled.div`
  hr {
    margin-bottom: 2rem;
    color: hsla(0, 0%, 88%, 1);
  }
  p {
    color: hsla(0, 0%, 51%, 1);
    font: 500 1.4rem var(--ff-noto);
    margin-block: 1rem 2rem;
  }
`;

const MoreStyledFollowButton = styled(FollowButton)`
  padding: 0.75rem 1.5rem;
  height: fit-content;
  margin-inline: revert;
  margin-top: revert;

  @media screen and (min-width: 20em) {
    margin-top: 1rem;
  }
  @media screen and (min-width: 45em) {
    margin-top: revert;
  }
  @media screen and (min-width: 55em) {
    margin-top: 1rem;
  }
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 25em) {
    display: revert;
  }

  @media screen and (min-width: 45em) {
    display: flex;
    margin-top: revert;
  }

  @media screen and (min-width: 55em) {
    display: revert;
  }
`;
