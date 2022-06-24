import styled from "styled-components";
import FilterBox from "../Components/Common/FilterBox";

const Home = () => {
  const filterList = {
    1: "Tweets",
    2: "Tweets & Replies",
    3: "Media",
    4: "Likes",
  };

  return (
    <Container>
      <FilterBox filterList={filterList} />
      <div>Main content goes here</div>
    </Container>
  );
};

export default Home;

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
