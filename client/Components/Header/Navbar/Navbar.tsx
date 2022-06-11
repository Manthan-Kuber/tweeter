import { StyledUl, UnderlinedDiv, Li } from "../../../styles/Navbar.styles";
import { NavProps } from "../../../interfaces/HeaderInterface";
import Link from "next/link";

const Navbar = ({ NavList, activeTab, setActiveTab }: NavProps) => {
  return (
    <nav>
      <StyledUl>
        {NavList.map((item) => (
          <Li
            key={item.id}
            onClick={() => {
              setActiveTab(item.name);
            }}
            active={activeTab === item.name ? true : false}
          >
            <Link href={item.url}>
              <a>{item.name}</a>
            </Link>
            {activeTab === item.name && <UnderlinedDiv />}
          </Li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
