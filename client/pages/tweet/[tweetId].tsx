import { useRouter } from "next/router";
import styled from "styled-components";
import { useGetTweetQuery, useGetTweetRepliesQuery } from "../../app/services/api";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import Tweet from "../../Components/Common/Tweet";

function TweetPage() {
  const {
    query: { tweetId },
  } = useRouter();
  const { data } = useGetTweetQuery(tweetId as string);
  const { data: TweetReplyData } = useGetTweetRepliesQuery({
    tweetId: data?.data[0]._id ?? "",
    skip: 0,
  });
  if (tweetId !== undefined && data !== undefined) {
    const tweet = data?.data[0];
    return (
      <Container>
        <Tweet
          key={tweet._id}
          authorName={tweet.creator[0].name}
          authorId={tweet.creator[0]._id}
          authorUserName={tweet.creator[0].username}
          authorFollowers={6969} //Change
          authorProfilePic={tweet.creator[0].profilePic}
          mediaList={tweet.media}
          authorTweet={tweet.tweet}
          tweetId={tweet._id}
          tweetCreationDate={tweet.createdAt}
          isSaved={tweet.saved.length === 0 ? false : true}
          isLiked={
            tweet.liked !== undefined && tweet.liked.length === 0 ? false : true
          }
          isRetweeted={tweet.retweeted.length === 0 ? false : true}
          commentCount={tweet.commentCount[0]}
          likes={tweet.likes}
          retweetedUsers={tweet.retweetedUsers}
          savedBy={tweet.savedBy}
          variant="tweetPage"
          TweetReplyData={TweetReplyData}
        />
      </Container>
    );
  }
  return <FullScreenLoader />;
}
export default TweetPage;

const Container = styled.div`
  width: min(95%, 85.5rem);
  margin-inline: auto;
  padding-block: 2rem;
`;
