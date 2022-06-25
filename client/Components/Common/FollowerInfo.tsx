import { motion } from "framer-motion";
import { BsFillPersonPlusFill } from "react-icons/bs";
import styled from "styled-components";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

interface Props {}
const FollowerInfo = (props: Props) => {
  return (
    <>
      {Array.from(Array(10).keys()).map((index, item) => (
        <div key={index}>
          <ProfileElementWrapper>
            <div>
              <ProfileInfo />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                eu erat eu ipsum placerat gravida. Duis nec nisl eget enim
                facilisis rhoncus ac sit amet turpis. Maecenas fermentum quis
                nulla consequat lobortis. Cras et elit at quam ornare efficitur.
                Aliquam erat volutpat. In leo lorem, rhoncus sed fermentum a,
                feugiat non metus. Vivamus cursus aliquet metus.
              </p>
            </div>
            <StyledFollowButton as={motion.button} whileTap={{ scale: 0.9 }}>
              <BsFillPersonPlusFill />
              Follow
            </StyledFollowButton>
          </ProfileElementWrapper>
          <hr />
        </div>
      ))}
    </>
  );
};
export default FollowerInfo;

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
