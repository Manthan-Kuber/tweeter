import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import { StyledHeader } from "./Header.styles";
import Profile from "./Profile";
import useWindowSize from "../../Hooks/useWindowDimensions";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import BottomNav from "./Navbar/BottomNav";
import { useState } from "react";

const NavList = [
  { id: 1, name: "Home", url: "/", icon: <AiFillHome size={24} /> },
  { id: 2, name: "Explore", url: "/explore", icon: <FaCompass size={24} /> },
  {
    id: 3,
    name: "Bookmarks",
    url: "/bookmarks",
    icon: <BsFillBookmarkFill size={24} />,
  },
];

type Props = {};
const Header = (props: Props) => {
  const { width } = useWindowSize();
  const [activeTab, setActiveTab] = useState(NavList[0].name);
  const PassedNavProps = {
    NavList: NavList,
    activeTab: activeTab,
    setActiveTab: setActiveTab,
  };
  return (
    <>
      <StyledHeader>
        <Image src="/tweeter.svg" width={"100%"} height={30} />
        {width! > 768 && <Navbar {...PassedNavProps} />}
        <Profile />
      </StyledHeader>
      {width! < 768 && <BottomNav {...PassedNavProps} />}
    </>
  );
};
export default Header;
