import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { MdOutlineModeComment } from "react-icons/md";
import styled from "styled-components";
import useWindowSize from "../../Hooks/useWindowDimensions";

const optionsList = [
  { id: 1, name: "Comments", icon: <MdOutlineModeComment />, onClickColor: "black" },
  { id: 2, name: "Retweet", icon: <AiOutlineRetweet />, onClickColor: "green" },
  { id: 3, name: "Likes", icon: <AiOutlineHeart />, onClickColor: "red" },
  { id: 4, name: "Saved", icon: <BsBookmark />, onClickColor: "blue" },
];

interface Props {}
const TweetOptions = (props: Props) => {
    const {width} = useWindowSize();
  return (
    <>
      <OptionsWrapper>
        {optionsList.map((option) => (
          <OptionWrapper key={option.id}>
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

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  line-height: 14px;
  font: 500 1.4rem var(--ff-noto);
  color: hsla(0, 0%, 31%, 1);
  padding: 1.5rem 3rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: hsla(0, 0%, 95%, 1);
  }

  span {
    display: inline-block;
  }
`;
