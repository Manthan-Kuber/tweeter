import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {
  useCreateTweetMutation,
  useGetTweetQuery,
} from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";
import ContentLoader from "./ContentLoader";
import CreateTweetComponent from "./CreateTweet";
import CustomModal from "./CustomModal";
import Tweet from "./Tweet";
import { useState } from "react";
import { useAppSelector } from "../../Hooks/store";

const ReplyModal = () => {
  const { query } = useRouter();
  const { data: TweetData } = useGetTweetQuery(query.replyTweetId as string);
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const [createTweet] = useCreateTweetMutation();
  const currentUserPfp = useAppSelector((state) => state.auth.user?.profilePic);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isHashtagPresent = /#[a-z]+/gi;
    const fileArray = fileList.map((item) => item.file);
    setFileList([]);
    setMessage("");
    const formData = new FormData();
    formData.append("tweetId", query.replyTweetId as string);
    formData.append("shared", "true");
    formData.append("tweet", message);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("media", fileArray[i]);
    }
    if (isHashtagPresent.test(message)) {
      const hashtagArray = message.match(isHashtagPresent);
      if (hashtagArray !== null) {
        for (let i = 0; i < hashtagArray.length; i++) {
          formData.append("hashtags", hashtagArray[i]);
        }
      }
    }
    try {
      await createTweet(formData).unwrap();
      toast.success(() => (
        <ToastMessage>Created Tweet Successfully</ToastMessage>
      ));
      router.beforePopState((state) => {
        state.options.scroll = false;
        return true;
      });
      router.back();
    } catch (error) {
      toast.error(() => <ToastMessage>Error in creating Tweet</ToastMessage>);
    }
  };
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
          <CreateTweetComponent
            isReplyImageVisible={true}
            placeholder="Tweet your Reply"
            btnText="Reply"
            message={message}
            setMessage={setMessage}
            fileList={fileList}
            setFileList={setFileList}
            onSubmit={onSubmit}
            replyImageUrl={currentUserPfp}
            variant="inTweet"
            focusOnClick={true}
          />
        </>
      ) : (
        <ContentLoader size={32} />
      )}
    </CustomModal>
  );
};
export default ReplyModal;
