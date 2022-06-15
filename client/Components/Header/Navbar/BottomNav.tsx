import styled from "styled-components";
import { StyledUl, UnderlinedDiv, Li } from "../../../styles/Navbar.styles";
import Link from "next/link";
import { motion } from "framer-motion";

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
            {activeTab === item.name && (
              <OverlinedDiv as={motion.div} layoutId="underline" />
            )}
            <Link href={item.url}>
              <a>{item.icon}</a>
            </Link>
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
  padding-block: 1.2rem;
  border-top:1px solid lightgray;
`;

const OverlinedDiv = styled(UnderlinedDiv)`
  bottom: revert;
  top: -13px;
  border-radius: 0px 0px 8px 8px;
  
`;

const BottomNavUl = styled(StyledUl)`
  justify-content: center;
`;
