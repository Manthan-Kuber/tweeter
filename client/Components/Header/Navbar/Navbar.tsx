import { StyledUl, UnderlinedDiv, Li } from "../../../styles/Navbar.styles";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Navbar = ({ NavList, activeTab, setActiveTab }: NavProps) => {
  const { route } = useRouter();
  useEffect(() => {
    if (!NavList.map((item) => item.url).includes(route)) setActiveTab("");
  }, [route]);

  return (
    <nav>
      <StyledUl>
        {NavList.map((item) => (
          <Li
            key={item.id}
            onClick={() => {
              setActiveTab(item.url);
            }}
            active={activeTab === item.url ? true : false}
          >
            <Link href={item.url}>
              <a>{item.name}</a>
            </Link>
            {activeTab === item.url && (
              <UnderlinedDiv as={motion.div} layoutId="underline" />
            )}
          </Li>
        ))}
      </StyledUl>
    </nav>
  );
};
export default Navbar;
