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
        {width! > 880 && <Navbar {...PassedNavProps} />}
        <Profile />
      </StyledHeader>
      <Hr/>
      {width! < 880 && <BottomNav {...PassedNavProps} />}
    </>
  );
};
export default Header;

export const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1.2rem ;
  width: min(95% ,102.4rem);
  margin-inline: auto;
`;

const Hr = styled.hr`
  border: 1px solid lightgray;
`


