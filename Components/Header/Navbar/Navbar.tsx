import { StyledUl, StyledNav, UnderlinedDiv, Li } from "./Navbar.styles";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import useWindowDimensions from "../../../Hooks/useWindowDimensions";

const NavList = [
  { id: 1, name: "Home",url:"/", icon: <AiFillHome size={20} /> },
  { id: 2, name: "Explore",url:"/explore", icon: <FaCompass size={20} /> },
  { id: 3, name: "Bookmarks",url:"/bookmarks", icon: <BsFillBookmarkFill size={20} /> },
];

type Props = {};
const Navbar = (props: Props) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
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
            {width! < 800 ? item.icon : item.name}
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
