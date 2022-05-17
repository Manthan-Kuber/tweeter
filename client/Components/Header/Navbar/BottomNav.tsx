import styled from "styled-components";
import { NavProps } from "../../../interfaces/HeaderInterface";
import { StyledUl, UnderlinedDiv, Li } from "./Navbar.styles";
import Link from "next/link";

export default function BottomNav({
  NavList,
  setActiveTab,
  activeTab,
}: NavProps) {
  return (
    <Container>
      <BottomNavUl>
        {NavList.map((item) => (
          <Li
            key={item.id}
            onClick={() => setActiveTab(item.name)}
            active={activeTab === item.name ? true : false}
          >
            <Link href={item.url}>
              <a>{item.icon}</a>
            </Link>
            {activeTab === item.name && <UnderlinedDiv />}
          </Li>
        ))}
      </BottomNavUl>
    </Container>
  );
}

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding-bottom: 2.4rem;
  padding-top: 1.8rem;
`;

const BottomNavUl = styled(StyledUl)`
  justify-content: center;
`;
