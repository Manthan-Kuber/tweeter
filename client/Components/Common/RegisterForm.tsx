import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "../../styles/registerPage.styles";
import InputGroup from "./InputGroup";
import {motion} from 'framer-motion'

const RegisterForm = (props: RegisterFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emailRef.current) throw Error("emailRef is not assigned");
    emailRef.current.focus();
  }, []);

  return (
    <form onSubmit={props.handleSubmit}>
      {props.isSignupForm && (
        <InputWrapper>
          <InputGroup
            formValues={props.formValues}
            setformValues={props.setformValues}
            value={props.formValues.fname}
            name="fname"
            placeholder="First Name"
            type="text"
          />
          <InputGroup
            formValues={props.formValues}
            setformValues={props.setformValues}
            value={props.formValues.lname}
            name="lname"
            placeholder="Last Name"
            type="text"
          />
          <ErrorMessage>{props.errMessage.name}</ErrorMessage>
        </InputWrapper>
      )}
      <InputGroup
        formValues={props.formValues}
        setformValues={props.setformValues}
        value={props.formValues.email}
        name="email"
        placeholder={props.emailPlaceholder}
        type="text"
        myRef={emailRef}
      />
      <ErrorMessage>{props.errMessage.email}</ErrorMessage>
      <InputGroup
        formValues={props.formValues}
        setformValues={props.setformValues}
        visible={props.visible}
        setVisible={props.setVisible}
        value={props.formValues.password}
        name="password"
        icon="password"
        placeholder={props.passwordPlaceholder}
        type="password"
        myRef={passwordRef}
      />
      <ErrorMessage>{props.errMessage.password}</ErrorMessage>
      <Button type="submit" as={motion.button} whileTap={{ scale: 0.9 }}>{props.btnText}</Button>
    </form>
  );
};
export default RegisterForm;

const ErrorMessage = styled.small`
  color: red;
  font: 600 1.2rem var(--ff-noto);
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 1rem;
`;
