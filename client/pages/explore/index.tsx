import { useState } from "react";
import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";

function Explore() {
  const filterList = [
    {
      id: 0,
      label: "Top",
    },
    {
      id: 1,
      label: "Latest",
    },
    {
      id: 2,
      label: "People",
    },
    {
      id: 3,
      label: "Media",
    },
  ];
  const [tab, setTab] = useState(0)

  return (
    <Container>
      <FilterBox filterList={filterList} tab={tab} setTab={setTab} />
      <div>Explore Content goes here</div>
    </Container>
  );
}

export default Explore;

const Container = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 2rem;

  //delete later
  & > div:last-child {
    background-color: green;
  }
`;
