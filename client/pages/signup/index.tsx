import { ReactElement } from "react";
import Footer from "../../Components/Footer/Footer";
import GlobalStyles from "../../GlobalStyles";
import styled from "styled-components";
import Head from "next/head";

interface Props {}
function SignUp({}: Props) {
  return (
    <Container>
      <h1>SignUp</h1>
      <Footer />
    </Container>
  );
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>Tweeter - SignUp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {page}
    </>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  height: 100vh;
`;
