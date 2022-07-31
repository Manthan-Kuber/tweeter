import Image from "next/image";
import styled from "styled-components";

const NoTweetsToShow = () => {
  return (
    <Container>
      <Image src="/notFound.svg" width={200} height={200} />
      <p>No Tweets To Show !</p>
    </Container>
  );
};
export default NoTweetsToShow;

const Container = styled.div`

  width: fit-content;
  margin-inline: auto;
  margin-top: 1rem;
  text-align: center;
  font:500 1.8rem var(--ff-montserrat);
  color: var(--clr-gray);
`;
