import { Dispatch, RefObject, SetStateAction } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import styled, { css } from "styled-components";

interface Props {
  placeholder?: string;
  icon?: string;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  type?: string;
  name: string;
  value: string;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >;
  formValues: {
    email: string;
    password: string;
  };
  myRef?: RefObject<HTMLInputElement>;
}
function Input({
  placeholder,
  icon,
  visible,
  setVisible,
  setformValues,
  formValues,
  type,
  name,
  value,
  myRef,
}: Props) {
  return (
    <Wrapper>
      <StyledInput
        type={type && visible ? "text" : type}
        name={name}
        value={value}
        onChange={(e) =>
          setformValues({ ...formValues, [name]: e.currentTarget.value })
        }
        ref={myRef}
      />
      <PlaceholderText
        className="placeholder-text"
        htmlFor={name}
        id={`placeholder-${name}`}
      >
        <Text className="text">{placeholder}</Text>
      </PlaceholderText>
      {icon === "password" ? (
        visible ? (
          <Icon
            as={AiFillEye}
            size={20}
            $cursorPointer
            onClick={
              setVisible
                ? () => {
                    setVisible(!visible);
                    myRef?.current?.focus();
                  }
                : undefined
            }
          />
        ) : (
          <Icon
            as={AiFillEyeInvisible}
            size={20}
            $cursorPointer
            onClick={
              setVisible
                ? () => {
                    setVisible(!visible);
                    myRef?.current?.focus();
                  }
                : undefined
            }
          />
        )
      ) : null}
    </Wrapper>
  );
}
export default Input;

const Text = styled.div`
  font: 1.4rem var(--ff-noto);
  background-color: transparent;
  color: #c7c7cd;
  transform: translate(0);
  transition: all 0.15s ease-in-out;
`;

const PlaceholderText = styled.label`
  position: absolute;
  inset-block: 0;
  left: 1.8rem;
  right: 0;
  border: 3px solid transparent;
  background-color: transparent;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input`
  padding-block: 1.6rem;
  padding-right: 4rem;
  padding-left: 2rem;
  border-radius: 8px;
  border: 1px solid #bdbdbd;
  accent-color: var(--clr-primary);
  outline-color: var(--clr-primary);
  width: 100%;

  &:focus + .placeholder-text .text,
  :not(&[value=""]) + .placeholder-text .text {
    background-color: white;
    font-size: 1.2rem;
    transform: translateY(-160%);
    padding-inline: 0.3rem;
  }

  &:focus + .placeholder-text .text {
    border-color: var(--clr-primary);
    color: var(--clr-primary);
  }
`;

const Wrapper = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Icon = styled.object<{ $cursorPointer?: boolean }>`
  position: absolute;
  right: 1.4rem;
  top: 15px;
  color: #828282;
  ${(props) =>
    props.$cursorPointer &&
    css`
      cursor: pointer;
    `}
`;
