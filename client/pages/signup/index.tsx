import { ReactElement, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import GlobalStyles from "../../GlobalStyles";
import styled from "styled-components";
import Head from "next/head";
import Image from "next/image";
import Input from "../../Components/Input";

interface Props {}
function SignUp({}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <SignUpBox>
        <Image src="/tweeter.svg" height={30} width="100%"  />
        <h5>Create Your Account</h5>
        <Input icon="mail" placeholder="Email" />
        <Input
          icon="password"
          placeholder="Password"
          visible={visible}
          setVisible={setVisible}
        />
      </SignUpBox>
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
      <Footer />
    </>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 7rem);
`;

const SignUpBox = styled.div`
  padding: 4rem;
  border-radius: 24px;
  width: min(90%, 48rem);
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  h5 {
    margin-block: 3rem;
    font: 700 clamp(1.8rem, 2vw + 0.5rem, 2.4rem) var(--ff-noto);
    color: #333;
  }
`;
