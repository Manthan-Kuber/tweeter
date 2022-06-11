import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "../../styles/registerPage.styles";
import InputGroup from "./InputGroup";

const RegisterForm = (props: RegisterFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emailRef.current) throw Error("emailRef is not assigned");
    emailRef.current.focus();
  }, []);

  return (
    <form onSubmit={props.handleSubmit}>
      <InputGroup
        formValues={props.formValues}
        setformValues={props.setformValues}
        value={props.formValues.email}
        name="email"
        icon="MdEmail"
        placeholder={props.placeholder1}
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
        placeholder={props.placeholder2}
        type="password"
        myRef={passwordRef}
      />
      <ErrorMessage>{props.errMessage.password}</ErrorMessage>
      <Button type="submit">{props.btnText}</Button>
    </form>
  );
};
export default RegisterForm;

const ErrorMessage = styled.small`
  color: red;
  font: 600 1.2rem var(--ff-noto);
`;
