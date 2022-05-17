import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import { StyledHeader } from "./Header.styles";
import Profile from "./Profile";
import BottomNav from "./Navbar/BottomNav";
import { NavProps } from "../../interfaces/HeaderInterface";
import useWindowSize from "../../Hooks/useWindowDimensions";


const Header = ({NavList,activeTab,setActiveTab}: NavProps) => {
  const { width } = useWindowSize();
  const PassedNavProps = {
    NavList: NavList,
    activeTab: activeTab,
    setActiveTab: setActiveTab,
  };
  return (
    <>
      <StyledHeader>
        <Image src="/tweeter.svg" width={"100%"} height={30} alt='tweeter' />
        {width! > 768 && <Navbar {...PassedNavProps} />}
        <Profile />
      </StyledHeader>
      {width! < 768 && <BottomNav {...PassedNavProps} />}
    </>
  );
};
export default Header;
