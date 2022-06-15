import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import FilterBox from "../../Components/Common/FilterBox";
import { useAppSelector } from "../../Hooks/store";

interface Props {}
function Explore({}: Props) {
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter();

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setIsLoading((prev) => !prev);
      }, 1500);
      replace("/register");
    } else if (token) {
      setIsLoading(false);
    }
  }, [token]);

  const filterList = {
    1: "Top",
    2: "Latest",
    3: "People",
    4: "Media",
  };

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Container>
          <FilterBox filterList={filterList} />
          <div>Explore Content goes here</div>
        </Container>
      )}
    </>
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
