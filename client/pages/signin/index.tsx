import { ReactElement, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import GlobalStyles from "../../GlobalStyles";
import styled from "styled-components";
import Head from "next/head";
import Image from "next/image";
import Input from "../../Components/Input";
import SignInIcon from "../../Components/SignInIcon";
import { motion } from "framer-motion";

const IconArray = [
  { id: 1, imgUrl: "/icons8-google.svg" },
  { id: 2, imgUrl: "/icons8-facebook.svg" },
  { id: 3, imgUrl: "/icons8-twitter.svg" },
  { id: 4, imgUrl: "/icons8-github.svg" },
];

interface Props {}
function SignUp({}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <SignUpBox>
        <Image src="/tweeter.svg" height={30} width="100%" />
        <h5>Create Your Account</h5>
        <Form>
          <Input icon="mail" placeholder="Email" />
          <Input
            icon="password"
            placeholder="Password"
            visible={visible}
            setVisible={setVisible}
          />
          <Button
            as={motion.button}
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 8px rgb(255,255,255)",
            }}
            whileTap={{ scale: 0.95 }}
            type='submit'
          >
            Sign In
          </Button>
        </Form>
        <SignInIconsWrapper>
          {IconArray.map((icon) => (
            <SignInIcon imgUrl={icon.imgUrl} />
          ))}
        </SignInIconsWrapper>
      </SignUpBox>
    </Container>
  );
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>Tweeter - SignIn</title>
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
  padding-block: 4rem;
  padding-inline: clamp(2rem, 3vw + 1.5rem, 4rem);
  border-radius: 24px;
  width: min(90%, 48rem);
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  h5 {
    margin-block: 3rem;
    font: 600 clamp(1.8rem, 2vw + 0.5rem, 2.4rem) var(--ff-noto);
    color: #333;
  }
`;

const Button = styled.button`
  background-color: var(--clr-primary);
  border: none;
  color: white;
  border-radius: 8px;
  padding-block: 1rem;
  font: 600 clamp(1.4rem, 2vw + 0.5rem, 1.6rem) var(--ff-noto);
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;
`;

const Form = styled.form`
  margin-bottom: 3rem;
`;

const SignInIconsWrapper = styled.div`
  display: flex;
  gap: clamp(1rem, 2vw + 0.5rem, 2rem);
  justify-content: center;
  align-items: center;
`;
