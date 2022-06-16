import React, { ReactElement, useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import Image from "next/image";
import SignInIcon from "../../Components/Common/SignInIcon";
import { motion } from "framer-motion";
import RegisterForm from "../../Components/Common/RegisterForm";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import { useLoginMutation, useSignupMutation } from "../../app/services/auth";
import { setCredentials } from "../../features/auth/authSlice";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import {
  Container,
  FormLi,
  FormTabUl,
  FormUnderlinedDiv,
  SignInIconsWrapper,
  SignUpBox,
} from "../../styles/registerPage.styles";
import Head from "next/head";

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
  fname: "",
  lname: "",
  email: "",
  password: "",
};

function Register() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(TabList[0].id);
  const [formValues, setformValues] = useState(InitialState);
  const [errMessage, setErrMessage] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { replace } = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        setIsLoading((prev) => !prev);
      }, 500);
      replace("/");
    } else if (!token) {
      setIsLoading(false);
    }
  }, [token]);

  const { fname, lname, email, password } = formValues;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      console.log(
        `user info: ${user.user.id} ${user.user.name} ${user.user.email} and token is ${user.token}`
      );
      dispatch(setCredentials(user));
      replace("/");
    } catch (err: any) {
      const { errors } = err.data;
      console.log(errors);
      setErrMessage({
        name: errors.name,
        email: errors.email,
        password: errors.password,
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signup({
        name: `${fname} ${lname}`,
        email,
        password,
      }).unwrap();
      console.log(
        `user info: ${user.user.id} ${user.user.name} ${user.user.email} and token is ${user.token}`
      );
      dispatch(setCredentials(user));
      replace("/");
    } catch (err: any) {
      const { errors } = err.data;
      console.log(errors);
      setErrMessage({
        name: errors.name,
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
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
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
                    <FormUnderlinedDiv
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </FormLi>
              ))}
            </FormTabUl>

            {activeTab === 1 ? (
              <RegisterForm
                {...FormProps}
                emailPlaceholder="Email"
                passwordPlaceholder="Password"
                btnText="Sign In"
                handleSubmit={handleLogin}
              />
            ) : (
              <RegisterForm
                {...FormProps}
                emailPlaceholder="Email"
                passwordPlaceholder="Password"
                btnText="Sign Up"
                handleSubmit={handleSignup}
                isSignupForm
              />
            )}

            <SignInIconsWrapper>
              {IconArray.map((icon) => (
                <SignInIcon key={icon.id} imgUrl={icon.imgUrl} />
              ))}
            </SignInIconsWrapper>
          </SignUpBox>
        </Container>
      )}
    </>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>
          Register / Tweeter
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {page}
      <Footer footerBg="white" />
    </>
  );
};

export default Register;
