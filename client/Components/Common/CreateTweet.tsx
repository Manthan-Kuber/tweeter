import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlineImage } from "react-icons/md";
import styled, { css } from "styled-components";
import { Icon } from "../../styles/inputGroup.styles";
import { nanoid } from "@reduxjs/toolkit";

const CreateTweet = (props: CreateTweetProps) => {
  const [message, setMessage] = useState<string>("");
  const [fileList, setFileList] = useState<Array<{ id: string; file: File }>>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileArray = fileList.map((item) => item.file);
    console.log(fileArray);
    console.log(message);
    setFileList([]);
    setMessage("");
    //Create Tweet Button and submit function
    const formData = new FormData();
    formData.append("reply", message);
    // formData.append("id",)
    for (let i = 0; i < fileList.length; i++) {
      formData.append("image", fileArray[i]);
    }
    Array.from(formData.values()).forEach((element) => {
      console.log(element);
    });
  };

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

  const tweetReply = document.getElementById("tweetReply");

  const autoResize = () => {
    if (tweetReply) {
      tweetReply.style.height = "auto";
      tweetReply.style.height = tweetReply.scrollHeight + "px";
    }
  };
  
  useEffect(() => {
    tweetReply?.addEventListener("input", autoResize, false);

    return () => {
      tweetReply?.removeEventListener("input", autoResize);
    };
  }, []);

  return (
    <ReplyContainer>
      {props.isReplyImageVisible && (
        <ReplyImageWrapper>
          <ReplyImage
            src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
            width={42}
            height={45}
          />
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
            placeholder={props.placeholder}
            id="tweetReply"
            rows={1}
            value={message}
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
          {props.variant !== "Home" && <hr />}
          <OptionsWrapper>
            <MediaIcon
              as={MdOutlineImage}
              size={28}
              color={"var(--clr-primary)"}
              $cursorPointer
              onClick={(e: React.SyntheticEvent) =>
                fileInputRef.current && fileInputRef.current.click()
              }
            />
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
`;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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