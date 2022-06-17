import Image from "next/image";
import styled from "styled-components";
import { Icon } from "../../styles/inputGroup.styles";

interface Props {}
const TweetReply = (props: Props) => {
  return (
    <ReplyContainer>
      <ReplyImageWrapper>
        <ReplyImage
          src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg"
          width={42}
          height={45}
        />
      </ReplyImageWrapper>
      <InputWrapper>
          <ReplyInput placeholder="Tweet your reply" rows={1} />
          <Icon $cursorPointer/>
      </InputWrapper>
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

  &:focus {
    outline-color: var(--clr-primary);
    outline-width: 2.5px;
    background-color: white;
  }
`;

const ReplyImage = styled(Image)`
  border-radius: 6px;
`;

const ReplyImageWrapper = styled.div`
  align-self: flex-start;
`;

const InputWrapper = styled.div`
    width: 100%;
`
