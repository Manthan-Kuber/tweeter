import React, { ReactElement, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import styled from "styled-components";
import Head from "next/head";
import Image from "next/image";
import SignInIcon from "../../Components/Common/SignInIcon";
import {
  Li,
  StyledUl,
  UnderlinedDiv,
} from "../../Components/Header/Navbar/Navbar.styles";
import { motion } from "framer-motion";
import RegisterForm from "../../Components/Common/RegisterForm";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../Hooks/store";
import { useLoginMutation, useSignupMutation } from "../../app/services/auth";
import { setCredentials } from "../../features/auth/authSlice";

const IconArray = [
  { id: 1, imgUrl: "/icons8-google.svg" },
  { id: 2, imgUrl: "/icons8-facebook.svg" },
  { id: 3, imgUrl: "/icons8-twitter.svg" },
  { id: 4, imgUrl: "/icons8-github.svg" },
];

const TabList = [
  { id: 1, name: "Sign In" },
  { id: 2, name: "Sign Up" },
];

const InitialState = {
  email: "",
  password: "",
};

function Register() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(TabList[0].id);
  const [formValues, setformValues] = useState<LoginRequest>(InitialState);
  const [errMessage, setErrMessage] = useState<LoginRequest>(InitialState);
  const { replace } = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(formValues).unwrap();
      console.log(
        `user info: ${user.user.id} ${user.user.email} and token is ${user.token}`
      );
      dispatch(setCredentials(user));
      replace("/");
    } catch (err: any) {
      const { errors } = err.data;
      console.log(errors);
      setErrMessage({
        email: errors.email,
        password: errors.password,
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signup(formValues).unwrap();
      console.log(
        `user info: ${user.user.id} ${user.user.email} and token is ${user.token}`
      );
      dispatch(setCredentials(user));
      replace("/");
    } catch (err: any) {
      const { errors } = err.data;
      console.log(errors);
      setErrMessage({
        email: errors.email,
        password: errors.password,
      });
    }
  };
  
  const FormProps = {
    visible: visible,
    setVisible: setVisible,
    formValues: formValues,
    setformValues: setformValues,
    errMessage: errMessage,
  };

  return (
    <Container>
      <SignUpBox>
        <Image src="/tweeter.svg" height={30} width="100%" />
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
          <RegisterForm
            {...FormProps}
            placeholder1="Email"
            placeholder2="Password"
            btnText="Sign In"
            handleSubmit={handleLogin}
          />
        ) : (
          <RegisterForm
            {...FormProps}
            placeholder1="Email"
            placeholder2="Password"
            btnText="Sign Up"
            handleSubmit={handleSignup}
          />
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

Register.getLayout = function getLayout(page: ReactElement) {
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

export default Register;

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

  @media all and (min-width: 55em) {
    box-shadow: 0 4px 12px -1px rgb(0 0 0 / 0.1),
      0 2px 8px -2px rgb(0 0 0 / 0.1);
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

const SignInIconsWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: clamp(1rem, 2vw + 0.5rem, 2rem);
  justify-content: center;
  align-items: center;
`;

const FormTabUl = styled(StyledUl)`
  margin-block: 3rem;
  gap: revert;
  justify-content: space-evenly;
  border-bottom: 1px solid #bdbdbd;
`;

const FormLi = styled(Li)<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding-block: 1rem;
  transition: background-color 0.15s ease-in;
  font-weight: ${({ active }) => (active ? 600 : 400)};
`;

const FormUnderlinedDiv = styled(UnderlinedDiv)`
  height: 3px;
  bottom: -0.7px;
`;
