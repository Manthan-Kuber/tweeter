import styled from "styled-components";

export const StyledUl = styled.ul`
  list-style: none;
  display: flex;
  gap: 8rem;
`;

export const Li = styled.li<{ active: boolean }>`
  font: 500 1.4rem var(--ff-poppins);
  color: ${(props) =>
    props.active ? "var(--clr-primary)" : "var(--clr-gray)"};
  cursor: pointer;
  position: relative;
  &:hover {
    color: var(--clr-primary);
  }
`;

export const StyledNav = styled.nav`
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);

  @media (min-width: 50em) {
    position: revert;
    bottom: revert;
    left: revert;
    transform: revert;
  }
`;

export const UnderlinedDiv = styled.div`
  position: absolute;
  bottom: -24px;
  inset-inline: 0;
  height: 3px;
  background: var(--clr-primary);
  border-radius: 8px 8px 0px 0px;
`;
