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
import useWindowSize from "../../hooks/useWindowDimensions";
import { ToastMessage } from "../../styles/Toast.styles";

const TweetOptions = ({
  setIsLiked,
  setIsSaved,
  setIsRetweeted,
  ...props
}: TweetOptionsProps) => {
  const { width } = useWindowSize();
  const [isActive, setIsActive] = useState({
    Reply: false,
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
      name: "Reply",
      icon: <MdModeComment size={16} />,
      activeColor: "rgba(47, 128, 237,1)",
      hoverColor: "rgba(47, 128, 237,0.2)",
      onActiveColor: "rgba(47, 128, 237,0.7)",
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        props.setIsCommentButtonClicked((prev: boolean) => !prev);
        props.setIsModalOpen(true);
      },
    },
    {
      id: 2,
      name: "Retweet",
      icon: <AiOutlineRetweet size={16} />,
      activeColor: "rgba(40, 175, 96,1)",
      hoverColor: "rgba(40, 175, 96,0.2)",
      onActiveColor: "rgba(40, 175, 96,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
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
      icon: <AiFillHeart size={16} />,
      activeColor: "rgba(235, 86, 86,1)",
      hoverColor: "rgba(235, 86, 86,0.2)",
      onActiveColor: "rgba(235, 86, 86,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
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
      icon: <BsBookmarkFill size={16} />,
      activeColor: "rgba(46, 156, 220,1)",
      hoverColor: "rgba(46, 156, 220,0.2)",
      onActiveColor: "rgba(46, 156, 220,0.7)",
      onClick: async (e: MouseEvent) => {
        e.stopPropagation();
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
            hoverColor={option.hoverColor}
            onActiveColor={option.onActiveColor}
          >
            {option.icon}
            {/* {width !== undefined && width > 880 && <span>{option.name}</span>} */}
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
  line-height: 14px;
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
