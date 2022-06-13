import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import styled from "styled-components";
import Profile from "./Profile";
import BottomNav from "./Navbar/BottomNav";
import useWindowSize from "../../Hooks/useWindowDimensions";

const Header = ({ NavList, activeTab, setActiveTab }: NavProps) => {
  const { width } = useWindowSize();
  const PassedNavProps = {
    NavList: NavList,
    activeTab: activeTab,
    setActiveTab: setActiveTab,
  };
  return (
    <>
      <StyledHeader>
        <Image src="/tweeter.svg" width={"100%"} height={30} alt="tweeter" />
        {width! > 768 && <Navbar {...PassedNavProps} />}
        <Profile />
      </StyledHeader>
      {width! < 768 && <BottomNav {...PassedNavProps} />}
    </>
  );
};
export default Header;

export const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 3rem;
  border-bottom: 2px solid lightgray;
`;
