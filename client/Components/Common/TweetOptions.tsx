import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { MdOutlineModeComment } from "react-icons/md";
import styled from "styled-components";
import {
  useLikeTweetMutation,
  useRetweetTweetMutation,
  useSaveTweetMutation,
} from "../../app/services/api";
import useWindowSize from "../../Hooks/useWindowDimensions";
import { ToastMessage } from "../../styles/Toast.styles";

const TweetOptions = ({
  setIsLiked,
  setIsSaved,
  setIsRetweeted,
  ...props
}: TweetOptionsProps) => {
  const { width } = useWindowSize();
  const [isActive, setIsActive] = useState({
    Comments: false,
    Retweet: props.isRetweeted,
    Like: props.isLiked,
    Saved: props.isSaved,
  });
  const [likeTweet] = useLikeTweetMutation();
  const [saveTweet] = useSaveTweetMutation();
  const [retweetTweet] = useRetweetTweetMutation();

  const optionsList = [
    {
      id: 1,
      name: "Comments",
      icon: <MdOutlineModeComment size={16} />,
      activeColor: "black",
      onClick: async () => {
        props.setIsCommentButtonClicked((prev: boolean) => !prev);
        if (isActive.Comments === false) {
          try {
            await props.commentFetchTrigger(props.tweetId).unwrap();
          } catch (error) {
            toast.error(() => (
              <ToastMessage>Error in Creating Comment</ToastMessage>
            ));
          }
        }
        setIsActive((prev) => ({ ...prev, Comments: !prev.Comments }));
      },
    },
    {
      id: 2,
      name: "Retweet",
      icon: <AiOutlineRetweet size={16} />,
      activeColor: "hsla(145, 63%, 42%, 1)",
      onClick: async () => {
        try {
          await retweetTweet(props.tweetId).unwrap();
          setIsActive({ ...isActive, Retweet: !isActive.Retweet });
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
      name: "Like",
      icon: <AiOutlineHeart size={16} />,
      activeColor: "hsla(0, 79%, 63%, 1)",
      onClick: async () => {
        try {
          await likeTweet(props.tweetId).unwrap();
          setIsActive({ ...isActive, Like: !isActive.Like });
          setIsLiked(!props.isLiked);
        } catch (error) {
          toast.error(() => <ToastMessage>Error in Liking Tweet</ToastMessage>);
        }
      },
    },
    {
      id: 4,
      name: "Saved",
      icon: <BsBookmark size={16} />,
      activeColor: "hsla(202, 71%, 52%, 1)",
      onClick: async () => {
        try {
          await saveTweet(props.tweetId).unwrap();
          setIsActive({ ...isActive, Saved: !isActive.Saved });
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
            isActive={(isActive as any)[option.name]}
            activeColor={option.activeColor}
          >
            {option.icon}
            {width !== undefined && width > 880 && <span>{option.name}</span>}
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
  isActive: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 1rem;
  line-height: 14px;
  font: 500 1.4rem var(--ff-noto);
  color: ${(props) =>
    props.isActive ? props.activeColor : "hsla(0, 0%, 31%, 1)"};
  padding: 1.5rem 3rem;
  border-radius: 8px;
  cursor: pointer;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  transition: all 0.4s;
  &:hover {
    background-color: rgba(130, 130, 130, 0.2);
  }
  &:active {
    background-color: rgba(130, 130, 130, 0.7);
  }

  span {
    display: inline-block;
  }
`;
