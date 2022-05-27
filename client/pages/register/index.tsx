import { ReactElement, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import styled from "styled-components";
import Head from "next/head";
import Image from "next/image";
import Input from "../../Components/Input";
import SignInIcon from "../../Components/SignInIcon";
import {
  Li,
  StyledUl,
  UnderlinedDiv,
} from "../../Components/Header/Navbar/Navbar.styles";
import { motion } from "framer-motion";

const IconArray = [
  { id: 1, imgUrl: "/icons8-google.svg" },
  { id: 2, imgUrl: "/icons8-facebook.svg" },
  { id: 3, imgUrl: "/icons8-twitter.svg" },
  { id: 4, imgUrl: "/icons8-github.svg" },
];

const TabList = [
  { id: 1, name: "Log In" },
  { id: 2, name: "Sign Up" },
];

interface Props {}
function SignUp({}: Props) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(TabList[0].id);
  return (
    <Container>
      <SignUpBox>
        <Image src="/tweeter.svg" height={30} width="100%" />
        <h5>Create Your Account</h5>
        <FormTabUl>
          {TabList.map((item) => (
            <FormLi
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              }}
              active={activeTab === item.id ? true : false}
            >
              {item.name}
              {activeTab === item.id && (
                <FormUnderlinedDiv as={motion.div} layoutId="underline" />
              )}
            </FormLi>
          ))}
        </FormTabUl>
        {activeTab === 1 ? (
          <Form>
            {/* Change form values ! when form state is added */}
            <Input
              value=""
              name="phone_email_pass"
              icon="MdEmail"
              placeholder="Phone or Email"
              type="text"
            />
            <Input
              value=""
              name="password"
              icon="password"
              placeholder="Password"
              visible={visible}
              setVisible={setVisible}
              type="password"
            />
            <Button type="submit">Sign In</Button>
          </Form>
        ) : (
          <Form>
            <Input
              value=""
              name="email"
              icon="mail"
              placeholder="Email"
              type="text"
            />
            <Input
              value=""
              name="password"
              icon="password"
              placeholder="Password"
              visible={visible}
              setVisible={setVisible}
              type="password"
            />
            <Button type="submit">Sign Up</Button>
          </Form>
        )}

        <SignInIconsWrapper>
          {IconArray.map((icon) => (
            <SignInIcon key={icon.id} imgUrl={icon.imgUrl} />
          ))}
        </SignInIconsWrapper>
      </SignUpBox>
    </Container>
  );
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Tweeter - Register</title>
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

export const Button = styled.button`
  background-color: var(--clr-primary);
  border: none;
  color: white;
  border-radius: 8px;
  padding-block: 1rem;
  font: 600 clamp(1.4rem, 2vw + 0.5rem, 1.6rem) var(--ff-noto);
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;

  &:hover {
    background-color: hsl(
      214.42105263157893,
      84.070796460177%,
      45.68627450980392%
    );
  }
`;

export const Form = styled.form`
  margin-bottom: 3rem;
`;

const SignInIconsWrapper = styled.div`
  display: flex;
  gap: clamp(1rem, 2vw + 0.5rem, 2rem);
  justify-content: center;
  align-items: center;
`;

const FormTabUl = styled(StyledUl)`
  margin-bottom: 3rem;
  gap: revert;
  justify-content: space-evenly;
`;

const FormLi = styled(Li)<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding-block: 0.8rem;
  background-color: ${({ active }) => active && "#eee"};
  transition: background-color 0.15s ease-in;
`;

const FormUnderlinedDiv = styled(UnderlinedDiv)`
  height: 1px;
  border-radius: revert;
  bottom: -1px;
`;
