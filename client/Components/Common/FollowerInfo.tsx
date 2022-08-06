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
              <p> 
               {item.bio}
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
