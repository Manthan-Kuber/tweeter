import styled from "styled-components";
import { TweetButton } from "../Components/Common/CreateTweet";

export const ToastMessage = styled.p`
  font: 500 1.4rem var(--ff-montserrat);
  color: hsla(0, 0%, 31%, 1);
`;

export const SubToastMessage = styled(ToastMessage)`
  color: hsla(0, 0%, 31%, 0.7);
`;

export const DiscardButton = styled(TweetButton)`
  background-color: rgba(255, 0, 0, 1);
  margin-top: 1rem;
  border-radius: 8px;
  &:hover {
    background-color: rgba(255, 0, 0, 0.7);
  }
`;
export const CancelButton = styled(DiscardButton)`
  background-color: white;
  border: 1px solid black;
  margin-left: 1rem;
  color: black;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;