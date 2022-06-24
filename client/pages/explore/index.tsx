import styled from "styled-components";
import FilterBox from "../../Components/Common/FilterBox";

function Explore() {
  const filterList = {
    1: "Top",
    2: "Latest",
    3: "People",
    4: "Media",
  };

  return (
    <Container>
      <FilterBox filterList={filterList} />
      <div>Explore Content goes here</div>
    </Container>
  );
}

export default Explore;

const Container = styled.div`
  width: min(95%, 102.4rem);
  margin-inline: auto;
  padding-block: 2rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;

  //delete later
  & > div:last-child {
    background-color: green;
  }
`;
