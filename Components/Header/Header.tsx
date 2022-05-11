import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import { StyledHeader } from "./Header.styles";
import Profile from "./Profile";
import useWindowSize from "../../Hooks/useWindowDimensions";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";

const NavList = [
  { id: 1, name: "Home",url:"/", icon: <AiFillHome size={20} /> },
  { id: 2, name: "Explore",url:"/explore", icon: <FaCompass size={20} /> },
  { id: 3, name: "Bookmarks",url:"/bookmarks", icon: <BsFillBookmarkFill size={20} /> },
];


type Props = {};
const Header = (props: Props) => {
  const {width} = useWindowSize();
  return (
    <StyledHeader>
      <Image src="/tweeter.svg" width={"100%"} height={30} />
      { width! > 800  && <Navbar NavList={NavList} />}
      <Profile/>
    </StyledHeader>
  );
};
export default Header;
