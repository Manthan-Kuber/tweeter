import { StyledUl, StyledNav, UnderlinedDiv, Li } from "./Navbar.styles";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";

interface Props  {
  NavList: {
    id: number;
    name: string;
    url: string;
    icon: JSX.Element;
  }[];
};
const Navbar = ({NavList}: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(NavList[0].name);
  return (
    <StyledNav>
      <StyledUl>
        {NavList.map((item) => (
          <Li
            key={item.id}
            onClick={() => {
              setActiveTab(item.name);
              router.push(item.url);
            }}
            active={activeTab === item.name ? true : false}
          >
            {item.name}
            {activeTab === item.name && (
              <UnderlinedDiv as={motion.div} layoutId="underlinedDiv" />
            )}
          </Li>
        ))}
      </StyledUl>
    </StyledNav>
  );
};
export default Navbar;
