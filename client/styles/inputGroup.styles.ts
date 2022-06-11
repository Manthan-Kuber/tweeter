import styled, { css } from "styled-components";

export const Text = styled.div`
  font: 1.4rem var(--ff-noto);
  background-color: transparent;
  color: #c7c7cd;
  transform: translate(0);
  transition: all 0.15s ease-in-out;
`;

export const PlaceholderText = styled.label`
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

export const StyledInput = styled.input`
  padding-block: 1.6rem;
  padding-right: 4rem;
  padding-left: 2rem;
  border-radius: 8px;
  outline: 1px solid #bdbdbd;
  border: none;
  accent-color: var(--clr-primary);
  width: 100%;

  &:focus {
    outline-color: var(--clr-primary);
  }

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

export const Wrapper = styled.div`
  margin-block: 1.5rem;
  position: relative;
`;

export const Icon = styled.object<{ $cursorPointer?: boolean }>`
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
