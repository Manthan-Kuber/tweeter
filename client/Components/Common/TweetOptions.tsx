import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsBookmarkFill } from "react-icons/bs";
import { MdModeComment } from "react-icons/md";
import styled from "styled-components";
import {
  useLikeTweetMutation,
  useRetweetTweetMutation,
  useSaveTweetMutation,
} from "../../app/services/api";
import { ToastMessage } from "../../styles/Toast.styles";

const TweetOptions = ({
  setIsLiked,
  setIsSaved,
  setIsRetweeted,
  ...props
}: TweetOptionsProps) => {
  const [isActive, setIsActive] = useState({
    Reply: false,
    Retweet: props.isRetweeted,
    Like: props.isLiked,
    Saved: props.isSaved,
  });
  const [likeTweet] = useLikeTweetMutation();
  const [saveTweet] = useSaveTweetMutation();
  const [retweetTweet] = useRetweetTweetMutation();
  const { push, asPath } = useRouter();

  const [counts, setCounts] = useState({
    comments: props.commentCount,
    retweets: props.retweetedUsers,
    likes: props.likes,
    saves: props.savedBy,
  });

  const optionsList = [
    {
      id: 1,
      count: counts.comments,
      name: "Reply",
      icon: <MdModeComment size={16} />,
      activeColor: "rgba(47, 128, 237,1)",
      hoverColor: "rgba(47, 128, 237,0.2)",
      onActiveColor: "rgba(47, 128, 237,0.7)",
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        props.setIsCommentButtonClicked((prev: boolean) => !prev);
        const urlParam = `?replyTweetId=${props.tweetId}`;
        push(`${asPath}${urlParam}`, undefined, {
          shallow: true,
          scroll: false,
        });
      },
    },
    {
      id: 2,
      count: counts.retweets,
      name: "Retweet",
      icon: <AiOutlineRetweet size={16} />,
      activeColor: "rgba(40, 175, 96,1)",
      hoverColor: "rgba(40, 175, 96,0.2)",
      onActiveColor: "rgba(40, 175, 96,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
        try {
          setIsActive({ ...isActive, Retweet: !isActive.Retweet });
          isActive.Retweet
            ? setCounts((prev) => ({ ...prev, retweets: prev.retweets - 1 }))
            : setCounts((prev) => ({ ...prev, retweets: prev.retweets + 1 }));
          await retweetTweet(props.tweetId).unwrap();
          setIsRetweeted(!props.isRetweeted);
        } catch (error) {
          toast.error(() => (
            <ToastMessage>Error in Retweeting Tweet</ToastMessage>
          ));
        }
      },
    },
    {
      id: 3,
      count: counts.likes,
      name: "Like",
      icon: <AiFillHeart size={16} />,
      activeColor: "rgba(235, 86, 86,1)",
      hoverColor: "rgba(235, 86, 86,0.2)",
      onActiveColor: "rgba(235, 86, 86,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
        try {
          setIsActive({ ...isActive, Like: !isActive.Like });
          isActive.Like
            ? setCounts((prev) => ({ ...prev, likes: prev.likes - 1 }))
            : setCounts((prev) => ({ ...prev, likes: prev.likes + 1 }));
          await likeTweet(props.tweetId).unwrap();
          setIsLiked(!props.isLiked);
        } catch (error) {
          toast.error(() => <ToastMessage>Error in Liking Tweet</ToastMessage>);
        }
      },
    },
    {
      id: 4,
      count: counts.saves,
      name: "Saved",
      icon: <BsBookmarkFill size={16} />,
      activeColor: "rgba(46, 156, 220,1)",
      hoverColor: "rgba(46, 156, 220,0.2)",
      onActiveColor: "rgba(46, 156, 220,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
        try {
          setIsActive({ ...isActive, Saved: !isActive.Saved });
          isActive.Saved
            ? setCounts((prev) => ({ ...prev, saves: prev.saves - 1 }))
            : setCounts((prev) => ({ ...prev, saves: prev.saves + 1 }));
          await saveTweet(props.tweetId).unwrap();
          setIsSaved(!props.isSaved);
        } catch (error) {
          toast.error(() => <ToastMessage>Error in Saving Tweet</ToastMessage>);
        }
      },
    },
  ];

  return (
    <>
      <OptionsWrapper>
        {optionsList.map((option) => (
          <OptionWrapper
            key={option.id}
            onClick={option.onClick}
            isActive={isActive[option.name as keyof typeof isActive]}
            activeColor={option.activeColor}
            hoverColor={option.hoverColor}
            onActiveColor={option.onActiveColor}
          >
            {option.icon}
            {option.count || null}
          </OptionWrapper>
        ))}
      </OptionsWrapper>
    </>
  );
};
export default TweetOptions;

export const OptionsWrapper = styled.div`
  border-block: 1px solid hsla(0, 0%, 95%, 1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

export const OptionWrapper = styled.div<{
  activeColor: string;
  onActiveColor: string;
  hoverColor: string;
  isActive: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 1rem;
  line-height: 16px;
  font: 500 1.4rem var(--ff-noto);
  color: ${(props) =>
    props.isActive ? props.activeColor : "hsla(0, 0%, 31%, 1)"};
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  transition: all 0.4s;
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
    color: ${({ activeColor }) => activeColor};
  }
  &:active {
    background-color: ${({ onActiveColor }) => onActiveColor};
  }

  span {
    display: inline-block;
  }
`;
