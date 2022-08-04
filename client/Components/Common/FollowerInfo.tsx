import { motion } from "framer-motion";
import { BsFillPersonPlusFill } from "react-icons/bs";
import styled from "styled-components";
import NoTweetsToShow from "./NoTweetsToShow";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

const FollowerInfo = ({ RawData, ...props }: FollowerInfoProps) => {
  return (
    <>
      {RawData.data.length === 0 ? <NoTweetsToShow message="Nothing to Show !" /> :   RawData.data.map((item) => (
        <div key={item._id}>
          <ProfileElementWrapper>
            <div>
              <ProfileInfo
                name={item.name}
                username={item.username}
                profilePic={item.profilePic}
              />
              {/* Replace by {item.bio} */}
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
