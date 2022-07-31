import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { MdOutlineModeComment } from "react-icons/md";
import styled from "styled-components";
import { useLazyGetCommentsQuery } from "../../app/services/api";
import useWindowSize from "../../Hooks/useWindowDimensions";
import { ToastMessage } from "../../styles/Toast.styles";

const TweetOptions = (props: TweetOptionsProps) => {
  const { width } = useWindowSize();
  const [isActive, setIsActive] = useState({
    Comments: false,
    Retweet: false,
    Like: false,
    Saved: false,
  });

  const optionsList = [
    {
      id: 1,
      name: "Comments",
      icon: <MdOutlineModeComment />,
      activeColor: "black",
      onClick: async () => {
        props.setIsCommentButtonClicked((prev: boolean) => !prev);
        if (isActive.Comments === false) {
          try{
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
      icon: <AiOutlineRetweet />,
      activeColor: "hsla(145, 63%, 42%, 1)",
      onClick: () => {
        setIsActive({ ...isActive, Retweet: !isActive.Retweet });
      },
    },
    {
      id: 3,
      name: "Like",
      icon: <AiOutlineHeart />,
      activeColor: "hsla(0, 79%, 63%, 1)",
      onClick: () => {
        setIsActive({ ...isActive, Like: !isActive.Like });
      },
    },
    {
      id: 4,
      name: "Saved",
      icon: <BsBookmark />,
      activeColor: "hsla(202, 71%, 52%, 1)",
      onClick: () => {
        setIsActive({ ...isActive, Saved: !isActive.Saved });
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

const OptionsWrapper = styled.div`
  border-block: 1px solid hsla(0, 0%, 95%, 1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const OptionWrapper = styled.div<{
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

  &:hover {
    background-color: hsla(0, 0%, 95%, 1);
  }

  span {
    display: inline-block;
  }
`;
