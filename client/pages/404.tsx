import Image from "next/image";
import styled from "styled-components";

export default function Custom404() {
  return (
    <Container>
      <div>
        <Image
          src="/404_notFound.svg"
          alt="Not Found Image"
          width={200}
          height={200}
        />
        <p>Page Not Found</p>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  text-align: center;
  min-height: calc(100vh - 13rem);
  font: 500 1.8rem var(--ff-montserrat);
  color: var(--clr-gray);
`;
