import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlineImage } from "react-icons/md";
import styled, { css } from "styled-components";
import { Icon } from "../../styles/inputGroup.styles";
import { nanoid } from "@reduxjs/toolkit";

interface Props {}
const TweetReply = (props: Props) => {
  const [reply, setReply] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const tweetReply = document.getElementById("tweetReply");

  const autoResize = () => {
    if (tweetReply) {
      tweetReply.style.height = "auto";
      tweetReply.style.height = tweetReply.scrollHeight + "px";
    }
  };

  tweetReply?.addEventListener("input", autoResize, false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileArray = fileList.map((item) => item.file);
    console.log(fileArray);
    console.log(reply);
    setFileList([]);
    setReply("");
    //Create Tweet Button and submit function
  };

  // const formData = new FormData();

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const tweetImgArray = Array.from(e.target.files);
    if (fileList.length + tweetImgArray.length < 5) {
      tweetImgArray.forEach((value) => {
        setFileList((prev) => [...prev, { id: nanoid(), file: value }]);
      });
    }
    // for (let i = 0; i < fileList.length; i++) {
    //   formData.append("image", fileList[i]);
    // }
    // console.log(formData);
  };

  useEffect(() => {
    if (reply.length || fileList.length > 0) setIsDisabled(false);
    else setIsDisabled(true);
  }, [reply, fileList]);

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
        <form onSubmit={onSubmit}>
          <ReplyInput
            placeholder="Tweet your reply"
            id="tweetReply"
            rows={1}
            value={reply}
            onChange={(e) => setReply((prev) => (prev = e.target.value))}
          />
          <input
            type="file"
            ref={fileInputRef}
            hidden
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={imageHandler}
          />
          {fileList.length > 0 && (
            <TweetImageArrayWrapper numOfImages={fileList.length}>
              {fileList.map((arrObject) => (
                <TweetImageWrapper key={arrObject.id}>
                  <TweetImage
                    src={URL.createObjectURL(arrObject.file)}
                    layout="responsive"
                    width="100%"
                    height="100%"
                  />
                  <CloseIcon
                    size={24}
                    onClick={() =>
                      setFileList((prev) =>
                        prev.filter(
                          (currentFile) => currentFile.id !== arrObject.id
                        )
                      )
                    }
                  />
                </TweetImageWrapper>
              ))}
            </TweetImageArrayWrapper>
          )}
          <hr />
          <OptionsWrapper>
            <MediaIcon
              as={MdOutlineImage}
              size={24}
              color={"var(--clr-gray)"}
              $cursorPointer
              onClick={(e: React.SyntheticEvent) =>
                fileInputRef.current && fileInputRef.current.click()
              }
            />
            <TweetButton disabled={isDisabled}>Tweet Reply</TweetButton>
          </OptionsWrapper>
        </form>
      </InputFormWrapper>
    </ReplyContainer>
  );
};
export default TweetReply;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const TweetButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 16px;
  background-color: rgba(47, 128, 237, 1);
  cursor: pointer;
  color: white;
  font: 600 1.4rem var(--ff-noto);
  border: none;
  &:hover {
    background-color: rgba(47, 128, 237, 0.9);
  }
  &:disabled {
    background-color: rgba(47, 128, 237, 0.3);
    cursor: auto;
  }
`;

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
  margin-bottom: 1rem;
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
  position: relative;
`;

const MediaIcon = styled(Icon)`
  position: revert;
`;

const CloseIcon = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  cursor: pointer;
`;

const TweetImageArrayWrapper = styled.div<{ numOfImages: number }>`
  margin-block: 1rem;
  ${(props) =>
    props.numOfImages >= 2 &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    `}
`;
