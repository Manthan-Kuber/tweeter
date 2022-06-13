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

export const UnderlinedDiv = styled.div`
  position: absolute;
  bottom: -21px;
  height: 4px;
  background: var(--clr-primary);
  border-radius: 8px 8px 0px 0px;
  width: calc(100% + 20px);
  left: -10px;
`;
