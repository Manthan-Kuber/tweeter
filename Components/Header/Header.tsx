import Image from "next/image";
import Navbar from "./Navbar/Navbar";
import { StyledHeader } from "./Header.styles";
import Profile from "./Profile/profile";

type Props = {};
const Header = (props: Props) => {
  return (
    <StyledHeader>
      <Image src="/tweeter.svg" width={"100%"} height={30} />
      <Navbar />
      <Profile/>
    </StyledHeader>
  );
};
export default Header;
