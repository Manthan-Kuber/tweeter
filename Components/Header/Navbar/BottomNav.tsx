import styled from "styled-components";
import { NavProps } from "../../../interfaces/HeaderInterface";

export default function BottomNav({ NavList }: NavProps) {
  return <Container>BottomNav</Container>;
}

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding-block: 3rem;
`;
