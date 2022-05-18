import { Dispatch, SetStateAction } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import styled, { css } from "styled-components";

interface Props {
  placeholder?: string;
  icon?: string;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
}
function Input({ placeholder, icon, visible, setVisible }: Props) {
  return (
    <Wrapper>
      <StyledInput placeholder={placeholder} />
      {icon === "mail" ? (
        <Icon as={MdEmail} size={20} />
      ) : icon === "password" ? (
        visible ? (
          <Icon
            as={AiFillEye}
            size={20}
            $cursorPointer
            onClick={setVisible ? () => setVisible(!visible) : undefined}
          />
        ) : (
          <Icon
            as={AiFillEyeInvisible}
            size={20}
            $cursorPointer
            onClick={setVisible ? () => setVisible(!visible) : undefined}
          />
        )
      ) : null}
    </Wrapper>
  );
}
export default Input;

const StyledInput = styled.input`
  padding-block: 1.6rem;
  padding-left: 4.4rem;
  border-radius: 8px;
  border: 1px solid #bdbdbd;
  accent-color: var(--clr-primary);
  width: 100%;
`;

const Wrapper = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Icon = styled.object<{ $cursorPointer?: boolean }>`
  position: absolute;
  left: 1.4rem;
  top: 15px;
  color: #828282;
  ${(props) =>
    props.$cursorPointer &&
    css`
      cursor: pointer;
    `}
`;
