import styled from "styled-components";
import { motion } from "framer-motion";

const FilterBox = ({ tab, setTab, filterList }: FilterBoxProps) => {
  return (
    <AsideContainer>
      <Ul>
        {filterList.map((filter) => (
          <Li
            key={filter.id}
            onClick={() => setTab(filter.id)}
            active={filter.id === tab}
          >
            {filter.id === tab && (
              <SideDiv
                as={motion.div}
                layoutId="sideDiv"
                animate={{
                  transition: {
                    duration: 0.25,
                  },
                }}
              />
            )}
            <p>{filter.label}</p>
          </Li>
        ))}
      </Ul>
    </AsideContainer>
  );
};
export default FilterBox;

export const AsideContainer = styled.aside`
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
