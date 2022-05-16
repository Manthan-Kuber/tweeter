import { StyledUl, UnderlinedDiv, Li } from "./Navbar.styles";
import { useRouter } from "next/router";
import { NavProps } from "../../../interfaces/HeaderInterface";


const Navbar = ({NavList,activeTab,setActiveTab}: NavProps) => {
  const router = useRouter();
  return (
    <nav>
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
              <UnderlinedDiv />
            )}
          </Li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
