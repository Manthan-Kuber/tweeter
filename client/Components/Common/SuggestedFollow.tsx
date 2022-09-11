import { motion } from "framer-motion";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BsFillPersonPlusFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useFollowUserMutation } from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";
import { AsideContainer } from "./FilterBox";
import NoTweetsToShow from "./NoTweetsToShow";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

const SuggestedFollow = ({
  suggestedFollowList,
  ...props
}: SuggestedFollowProps) => {
  const router = useRouter();
  const [followUser] = useFollowUserMutation();
  return (
    <Article as="article" id="suggestedFollowerScroll">
      <h3>Whom to follow</h3>
      <InfiniteScroll
        dataLength={suggestedFollowList.length}
        next={props.getSuggestedFollowers}
        hasMore={props.hasMore}
        loader={<p>Loading...</p>} //Change Later
        scrollableTarget="suggestedFollowerScroll"
        endMessage={
          suggestedFollowList.length !== 0 && <p>You have reached the end...</p>
        } //Change Later
      >
        {suggestedFollowList.length === 0 ? (
          <NoTweetsToShow message="No More Suggestions to show" />
        ) : (
          suggestedFollowList.map((item) => (
            <FollowerContainer
              key={item._id}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${item._id}`);
              }}
            >
              <hr />
              <ProfileInfoWrapper>
                <div>
                  <ProfileInfo
                    name={item.name}
                    username={item.username}
                    profilePic={item.profilePic}
                    followerCount={item.followerCount}
                  />
                </div>
                <MoreStyledFollowButton
                  as={motion.button}
                  whileTap={{ scale: 0.9 }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await followUser(item._id);
                      toast.success(() => (
                        <ToastMessage>Followed User Successfully</ToastMessage>
                      ));
                    } catch (error) {
                      toast.error(() => (
                        <ToastMessage>Error in Following User</ToastMessage>
                      ));
                    }
                  }}
                >
                  <BsFillPersonPlusFill />
                  Follow
                </MoreStyledFollowButton>
              </ProfileInfoWrapper>
              <p>{item.bio}</p>
            </FollowerContainer>
          ))
        )}
      </InfiniteScroll>
    </Article>
  );
};
export default SuggestedFollow;

const Article = styled(AsideContainer)`
  padding: 1rem;
  color: #4f4f4f;
  max-height: 35rem;
  overflow-y: scroll;
  & > h3 {
    color: #333;
    font: revert;
  }
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

  & > div {
    cursor: pointer;
  }

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
