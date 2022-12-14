import styled from "styled-components";
import { Li, StyledUl, UnderlinedDiv } from "./Navbar.styles";

export const LogoImageWrapper = styled.div`
  width: fit-content;
  position:relative;
  margin-inline: auto;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4.8rem);
  background-color: white;
`;

export const SignUpBox = styled.div`
  padding-block: 6rem;
  padding-inline: clamp(2rem, 3vw + 1.5rem, 4rem);
  border-radius: 24px;
  width: min(90%, 47rem);
  display: flex;
  flex-direction: column;

  @media all and (min-width: 55em) {
    box-shadow: 0 4px 12px -1px rgb(0 0 0 / 0.1),
      0 2px 8px -2px rgb(0 0 0 / 0.1);
  }
`;

export const Button = styled.button`
  background-color: var(--clr-primary);
  border: none;
  color: white;
  border-radius: 8px;
  padding-block: 1rem;
  font: 600 clamp(1.4rem, 2vw + 0.5rem, 1.6rem) var(--ff-noto);
  cursor: pointer;
  width: 100%;
  margin-top: 1.8rem;

  &:hover {
    background-color: hsl(
      214.42105263157893,
      84.070796460177%,
      45.68627450980392%
    );
  }

  &:disabled {
    background-color: rgba(47, 128, 237, 0.7);
    cursor: not-allowed;
  }
`;

export const SignInIconsWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: clamp(1rem, 2vw + 0.5rem, 2rem);
  justify-content: center;
  align-items: center;
`;

export const FormTabUl = styled(StyledUl)`
  margin-top: 3rem;
  margin-bottom: 1rem;
  gap: revert;
  justify-content: space-evenly;
  border-bottom: 1px solid #bdbdbd;
`;

export const FormLi = styled(Li)<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding-block: 1rem;
  transition: background-color 0.15s ease-in;
  font-weight: ${({ active }) => (active ? 600 : 400)};
`;

export const FormUnderlinedDiv = styled(UnderlinedDiv)`
  height: 3px;
  bottom: -0.7px;
  left: 0;
`;
