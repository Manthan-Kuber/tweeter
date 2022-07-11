import Image from "next/image";
import React, { useRef, useState } from "react";
import { MdOutlineImage } from "react-icons/md";
import styled from "styled-components";
import { Icon } from "../../styles/inputGroup.styles";

interface Props {}
const TweetReply = (props: Props) => {
  const [reply, setReply] = useState<string>("");
  const [fileList, setFileList] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tweetReply = document.getElementById("tweetReply");

  const autoResize = () => {
    if (tweetReply) {
      tweetReply.style.height = "auto";
      tweetReply.style.height = tweetReply.scrollHeight + "px";
    }
  };

  tweetReply?.addEventListener("input", autoResize, false);

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const tweetImgArray = Array.from(e.target.files).map((tweetImg) =>
      URL.createObjectURL(tweetImg)
    );
    if (fileList.length + tweetImgArray.length < 5) {
      setFileList((prev) => prev.concat(tweetImgArray));
    } else {
      alert("You can upload a maximum of 4 files");
    }
  };

  return (
    <ReplyContainer>
      <ReplyImageWrapper>
        <ReplyImage
          src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
          width={42}
          height={45}
        />
      </ReplyImageWrapper>
      <InputFormWrapper id="formWrapper">
        <form>
          <ReplyInput placeholder="Tweet your reply" id="tweetReply" rows={1} />
          <input
            type="file"
            ref={fileInputRef}
            hidden
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={imageHandler}
          />
          {fileList.length > 0 &&
            fileList.map((imgUrl) => (
              <TweetImageWrapper key={imgUrl}>
                <TweetImage
                  src={imgUrl}
                  width={100}
                  height={100}
                  layout="responsive"
                />
              </TweetImageWrapper>
            ))}
          <hr />
        </form>
        <MediaIcon
          as={MdOutlineImage}
          size={24}
          color={"var(--clr-gray)"}
          $cursorPointer
          onClick={(e: React.SyntheticEvent) =>
            fileInputRef.current && fileInputRef.current.click()
          }
        />
      </InputFormWrapper>
    </ReplyContainer>
  );
};
export default TweetReply;

const ReplyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReplyInput = styled.textarea`
  padding-right: 1rem;
  font-family: var(--ff-poppins);
  font-size: 1.6rem;
  width: 100%;
  background-color: #f8f8f8;
  color: hsla(0, 0%, 31%, 1);
  border: none;
  resize: none;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
  }
`;

const ReplyImage = styled(Image)`
  border-radius: 6px;
`;

const ReplyImageWrapper = styled.div`
  align-self: flex-start;
`;

const InputFormWrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 1rem 2rem;
  border-radius: 8px;
  outline: 1.5px solid hsl(0, 0%, 74%, 1);
  border: none;
  accent-color: var(--clr-primary);
  width: 100%;
  background-color: hsl(0, 0%, 74%, 0.1);
  font-family: var(--ff-poppins);
  font-size: 1.2rem;
  resize: none;

  hr {
    border: 0.5px solid rgb(130, 130, 130, 0.4);
  }
`;

const TweetImage = styled(Image)`
  border-radius: 16px;
`;

const TweetImageWrapper = styled.div`
  margin-block: 0.5rem 1rem;
`;

const MediaIcon = styled(Icon)`
  margin-top: 0.5rem;
  margin-bottom: -1rem;
  position: revert;
`;
