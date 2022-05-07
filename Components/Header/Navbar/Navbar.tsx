import { StyledUl } from "./Navbar.styles";

const NavList = [
  { id: 1, name: "Home" },
  { id: 2, name: "Explore" },
  { id: 3, name: "Bookmarks" },
];

type Props = {};
const Navbar = (props: Props) => {
  return (
    <nav>
      <StyledUl>
        {NavList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
