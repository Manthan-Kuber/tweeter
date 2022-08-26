import Image from "next/image";
import styled from "styled-components";

const NoTweetsToShow = ({ message, ...props }: NoTweetsToShowProps) => {
  return (
    <Container>
      <Image
        src="/notFound.svg"
        alt="Not Found Image"
        width={200}
        height={200}
      />
      <p>{message}</p>
    </Container>
  );
};
export default NoTweetsToShow;

const Container = styled.div`
  width: fit-content;
  margin-inline: auto;
  margin-top: 1rem;
  text-align: center;
  font: 500 1.8rem var(--ff-montserrat);
  color: var(--clr-gray);
`;
