import { useRouter } from "next/router";
import {
  useCreateTweetMutation,
  useGetTweetQuery,
} from "../../app/services/api";
import ContentLoader from "./ContentLoader";
import CreateTweetComponent from "./CreateTweet";
import CustomModal from "./CustomModal";
import Tweet from "./Tweet";
import { useState } from "react";
import { useAppSelector } from "../../Hooks/store";

const ReplyModal = () => {
  const { query } = useRouter();
  const { data: TweetData } = useGetTweetQuery(query.replyTweetId as string);
  const currentUserPfp = useAppSelector((state) => state.auth.user?.profilePic);

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
      maxModalHeight="60%"
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
          <CreateTweetComponent
            isReplyImageVisible={true}
            placeholder="Tweet your Reply"
            btnText="Reply"
            replyImageUrl={currentUserPfp}
            variant="inTweet"
            focusOnClick={true}
            shouldCreateReply={true}
          />
        </>
      ) : (
        <ContentLoader size={32} />
      )}
    </CustomModal>
  );
};
export default ReplyModal;
