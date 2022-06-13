import { StyledUl, UnderlinedDiv, Li } from "../../../styles/Navbar.styles";
import Link from "next/link";
import { motion } from "framer-motion";

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
            {activeTab === item.name && (
              <UnderlinedDiv as={motion.div} layoutId="underline" />
            )}
          </Li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
