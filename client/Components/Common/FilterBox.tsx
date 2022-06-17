import styled from "styled-components";
import { motion } from "framer-motion";
import { useState } from "react";

const FilterBox = ({ filterList }: FilterBoxProps) => {
  const [tab, setTab] = useState(1);
  return (
    <Container>
      <Ul>
        {Object.entries(filterList).map(([key, value]) => (
          <Li
            key={key}
            onClick={() => setTab(parseInt(key))}
            active={parseInt(key) === tab}
          >
            {parseInt(key) === tab && (
              <SideDiv
                as={motion.div}
                layoutId="sidediv"
                animate={{
                  transition: {
                    duration: 0.25,
                  },
                }}
              />
            )}
            <p>{value}</p>
          </Li>
        ))}
      </Ul>
    </Container>
  );
};
export default FilterBox;

const Container = styled.aside`
  background-color: white;
  padding-block: 2.5rem;
  font: 600 1.4rem var(--ff-poppins);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  height: fit-content;
  min-width: 15rem;
`;

const Ul = styled.ul`
  display: grid;
  gap: 2rem;
`;

const Li = styled.li<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: ${(props) =>
    props.active ? "var(--clr-primary)" : "var(--clr-gray)"};

  p {
    padding-left: 2rem;
  }
`;

const SideDiv = styled.div`
  background-color: var(--clr-primary);
  width: 5px;
  height: 4rem;
  border-radius: 0px 8px 8px 0px;
  position: absolute;
`;
