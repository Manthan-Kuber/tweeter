import styled from "styled-components";
import { NavProps } from "../../../interfaces/HeaderInterface";
import { StyledUl, UnderlinedDiv,Li } from "./Navbar.styles";
import { useRouter } from "next/router";

export default function BottomNav({
  NavList,
  setActiveTab,
  activeTab,
}: NavProps) {
  const router = useRouter();
  return (
    <Container>
      <BottomNavUl>
        {NavList.map((item) => (
          <Li
            key={item.id}
            onClick={() => {
              setActiveTab(item.name);
              router.push(item.url);
            }}
            active={activeTab === item.name ? true : false}
          >
            {item.icon}
            {activeTab === item.name && (
              <UnderlinedDiv/>
            )}
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
`
