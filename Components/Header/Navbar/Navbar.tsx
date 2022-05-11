import { StyledUl, UnderlinedDiv, Li } from "./Navbar.styles";
import { motion } from "framer-motion";
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
              <UnderlinedDiv as={motion.div} layoutId="underlinedDiv" />
            )}
          </Li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
