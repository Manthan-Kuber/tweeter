import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import { MdOutlineImage } from "react-icons/md";
import styled, { css } from "styled-components";
import { Icon } from "../../styles/inputGroup.styles";
import { nanoid } from "@reduxjs/toolkit";

const CreateTweet = ({
  fileList,
  message,
  isMediaInputVisible = true,
  setMessage,
  setFileList,
  onSubmit,
  ...props
}: CreateTweetProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const tweetInputRef = useRef<HTMLTextAreaElement>(null);

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const tweetImgArray = Array.from(e.target.files);
    if (fileList.length + tweetImgArray.length < 5) {
      tweetImgArray.forEach((value) => {
        setFileList((prev) => [...prev, { id: nanoid(), file: value }]);
      });
    }
  };

  useEffect(() => {
    if (message.length || fileList.length > 0) setIsDisabled(false);
    else setIsDisabled(true);
  }, [message, fileList]);

  useEffect(() => {
    (() => {
      if (tweetInputRef.current) {
        tweetInputRef.current.style.height = "auto";
        tweetInputRef.current.style.height =
          tweetInputRef.current.scrollHeight + "px";
      }
    })();
  }, [message]);

  useEffect(() => {
    props.focusOnClick && tweetInputRef.current?.focus();
  }, []);

  return (
    <ReplyContainer>
      {props.isReplyImageVisible && (
        <ReplyImageWrapper>
          <ReplyImage src={props.replyImageUrl!} width={42} height={45} />
        </ReplyImageWrapper>
      )}
      <InputFormWrapper id="formWrapper" variant={props.variant}>
        {props.variant === "Home" && (
          <HomeVariantContainer>
            <h3>Tweet Something</h3>
            <hr />
          </HomeVariantContainer>
        )}
        <form onSubmit={onSubmit}>
          <ReplyInput
            ref={tweetInputRef}
            placeholder={props.placeholder}
            id="tweetReply"
            rows={1}
            value={message}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setMessage((prev) => (prev = e.target.value))}
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
            <TweetImageArrayWrapper
              numOfImages={fileList.length}
              variant={props.variant}
            >
              {fileList.map((arrObject) => (
                <TweetImageWrapper key={arrObject.id} variant={props.variant}>
                  <TweetImage
                    src={URL.createObjectURL(arrObject.file)}
                    layout="fill"
                    alt="Preview Image"
                  />
                  <CloseIcon
                    size={32}
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
          {props.variant !== "Home" && <hr />}
          <OptionsWrapper isMediaInputVisible={isMediaInputVisible}>
            {isMediaInputVisible && (
              <MediaIcon
                as={MdOutlineImage}
                size={40}
                color={"var(--clr-primary)"}
                $cursorPointer
                onClick={(e: React.SyntheticEvent) =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              />
            )}
            <TweetButton disabled={isDisabled}>{props.btnText}</TweetButton>
          </OptionsWrapper>
        </form>
      </InputFormWrapper>
    </ReplyContainer>
  );
};
export default CreateTweet;

const HomeVariantContainer = styled.div`
  hr {
    margin-block: 1rem;
  }
  h3 {
    font: revert;
    font-size: 1.6rem;
    color: #333;
  }
`;

const OptionsWrapper = styled.div<{ isMediaInputVisible: boolean }>`
  display: flex;
  justify-content: ${({ isMediaInputVisible }) =>
    !isMediaInputVisible ? "flex-end" : "space-between"};
  align-items: center;
  margin-top: 1rem;
`;

export const TweetButton = styled.button`
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
    cursor: not-allowed;
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
  background-color: transparent;
  color: hsla(0, 0%, 31%, 1);
  border: none;
  resize: none;
  margin-bottom: 1.5rem;
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

const InputFormWrapper = styled.div<{ variant?: string }>`
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
  padding-top: 1.5rem;
  ${({ variant }) =>
    variant === "Home" &&
    css`
      background-color: white;
      box-shadow: 0px 2px 4px 0px hsla(0, 0%, 0%, 0.05);
      outline: none;
    `}

  hr {
    border: 0.5px solid rgb(130, 130, 130, 0.4);
  }
`;

const TweetImage = styled(Image)`
  border-radius: 16px;
`;

const TweetImageWrapper = styled.div<{ variant?: string }>`
  position: relative;
  width: min(45rem, 100%);
  aspect-ratio: 1/1;
  border-radius: 16px;
  margin-inline: auto;
  @media screen and (min-width: 20em) {
    height: 20rem;
  }
  @media screen and (min-width: 55em) {
    height: 45rem;
  }
  margin-top: ${({ variant }) => variant !== "Home" && "1rem"};
`;

const MediaIcon = styled(Icon)`
  position: revert;
  transition: all 0.4s;
  padding: 8px;
  border-radius: 100%;
  &:hover {
    background-color: rgba(47, 128, 237, 0.2);
  }
  &:active {
    background-color: rgba(47, 128, 237, 0.7);
  }
`;

const CloseIcon = styled(GrClose)`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  cursor: pointer;
  border-radius: 100%;
  padding: 8px;
  transition: all 0.4s;
  background-color: rgba(130, 130, 130, 0.9);
  &:hover {
    background-color: rgba(130, 130, 130, 0.7);
  }
  &:active {
    background-color: rgba(130, 130, 130, 0.5);
  }
`;

export const TweetImageArrayWrapper = styled.div<{
  numOfImages: number;
  variant?: string;
}>`
  margin-block: 1rem;
  ${({ numOfImages, variant = "Home" }) =>
    numOfImages >= 2 &&
    variant === "Home" &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      justify-items: stretch;
    `}
`;
