import { useRouter } from "next/router";
import { useGetTweetQuery } from "../../app/services/api";
import ContentLoader from "./ContentLoader";
import CustomModal from "./CustomModal";
import Tweet from "./Tweet";

const ReplyModal = () => {
  const { query } = useRouter();
  const { data: TweetData } = useGetTweetQuery(query.replyTweetId as string);
  return (
    <CustomModal
      modalIsOpen={!!query.replyTweetId}
      modalHeight="fit-content"
      modalTitle={
        TweetData ? (
          `Reply to ${TweetData.data[0].creator[0].username}'s Tweet`
        ) : (
          <ContentLoader size={20} />
        )
      }
      shouldCloseOnOverlayClick={true}
    >
      {TweetData ? (
        <>
          <Tweet
            authorId={TweetData.data[0].creator[0]._id}
            authorName={TweetData.data[0].creator[0].name}
            authorUserName={TweetData.data[0].creator[0].username}
            authorFollowers={0}
            authorProfilePic={TweetData.data[0].creator[0].profilePic}
            authorTweet={TweetData.data[0].tweet}
            mediaList={TweetData.data[0].media}
            tweetId={TweetData.data[0]._id}
            tweetCreationDate={TweetData.data[0].createdAt}
            variant="inTweet"
            commentCount={0}
            isSaved={false}
            isLiked={false}
            isRetweeted={false}
            likes={0}
            retweetedUsers={0}
            savedBy={0}
            fetchReply={false} // Don't fetch reply for reply modal
          />
        </>
      ) : (
        <ContentLoader size={32} />
      )}
    </CustomModal>
  );
};
export default ReplyModal;
