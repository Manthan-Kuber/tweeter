import { motion } from "framer-motion";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BsFillPersonPlusFill } from "react-icons/bs";
import styled from "styled-components";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";
import NoTweetsToShow from "./NoTweetsToShow";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

const FollowerInfo = ({ RawData, setModalIsOpen }: FollowerInfoProps) => {
  const router = useRouter();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId).unwrap();
      toast.success(() => (
        <ToastMessage>Followed User Successfully</ToastMessage>
      ));
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Following User</ToastMessage>);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId).unwrap();
      toast.success(() => (
        <ToastMessage>Unfollowed User Successfully</ToastMessage>
      ));
    } catch (error) {
      console.log(error);
      toast.error(() => <ToastMessage>Error in Unfollowing User</ToastMessage>);
    }
  };
  return (
    <>
      {RawData.data.length === 0 ? (
        <NoTweetsToShow message="Nothing to Show !" />
      ) : (
        RawData.data.map((item) => (
          <div key={item._id}>
            <ProfileElementWrapper>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push(`/${item._id}`);
                  setModalIsOpen(false);
                }}
              >
                <ProfileInfo
                  name={item.name}
                  username={item.username}
                  profilePic={item.profilePic}
                />
                <p>{item.bio}</p>
              </div>
              <StyledFollowButton
                as={motion.button}
                whileTap={{ scale: 0.9 }}
                onClick={
                  item.followed.length === 0
                    ? () => handleFollow(item._id)
                    : () => handleUnfollow(item._id)
                }
              >
                <BsFillPersonPlusFill />
                {item.followed.length === 0 ? "Follow" : "Unfollow"}
              </StyledFollowButton>
            </ProfileElementWrapper>
            <hr />
          </div>
        ))
      )}
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
