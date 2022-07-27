import { motion } from "framer-motion";
import { BsFillPersonPlusFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { AsideContainer } from "./FilterBox";
import { FollowButton } from "./ProfileBox";
import ProfileInfo from "./ProfileInfo";

const SuggestedFollow = ({
  suggestedFollowList,
  ...props
}: SuggestedFollowProps) => {
  return (
    <Article as="article" id="suggestedFollowerScroll">
      <h5>Whom to follow</h5>
      <InfiniteScroll
        dataLength={suggestedFollowList.length}
        next={props.getSuggestedFollowers}
        hasMore={props.hasMore}
        loader={<p>Loading...</p>} //Change Later
        scrollableTarget="suggestedFollowerScroll"
        endMessage={<p>You've reached the end</p>} //Change Later
      >
        {suggestedFollowList.map((item) => (
          <FollowerContainer key={item._id}>
            <hr />
            <ProfileInfoWrapper>
              <ProfileInfo
                name={item.name}
                profilePic={item.profilePic}
                followerCount={item.followerCount}
              />
              <MoreStyledFollowButton
                as={motion.button}
                whileTap={{ scale: 0.9 }}
              >
                <BsFillPersonPlusFill />
                Follow
              </MoreStyledFollowButton>
            </ProfileInfoWrapper>
            <p>{item.bio}</p>
          </FollowerContainer>
        ))}
      </InfiniteScroll>
    </Article>
  );
};
export default SuggestedFollow;

const Article = styled(AsideContainer)`
  padding: 1rem;
  color: #4f4f4f;
  max-height: 40rem;
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
