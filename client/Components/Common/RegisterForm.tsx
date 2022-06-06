import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "../../pages/register";
import Input from "./Input";

interface Props {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >;
  formValues: {
    email: string;
    password: string;
  };
  placeholder1: string;
  placeholder2: string;
  btnText: string;
  handleSubmit: (
    e: React.FormEvent,
  ) => Promise<void>;
  errMessage: {
    email: string;
    password: string;
  };
}
const RegisterForm = ({
  visible,
  setVisible,
  setformValues,
  formValues,
  placeholder1,
  placeholder2,
  btnText,
  handleSubmit,
  errMessage,
}: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emailRef.current) throw Error("emailRef is not assigned");
    emailRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Input
        formValues={formValues}
        setformValues={setformValues}
        value={formValues.email}
        name="email"
        icon="MdEmail"
        placeholder={placeholder1}
        type="text"
        myRef={emailRef}
      />
      <ErrorMessage>{errMessage.email}</ErrorMessage>
      <Input
        formValues={formValues}
        setformValues={setformValues}
        visible={visible}
        setVisible={setVisible}
        value={formValues.password}
        name="password"
        icon="password"
        placeholder={placeholder2}
        type="password"
        myRef={passwordRef}
      />
      <ErrorMessage>{errMessage.password}</ErrorMessage>
      <Button type="submit" >{btnText}</Button>
    </form>
  );
};
export default RegisterForm;

const ErrorMessage = styled.small`
  color: red;
  font: 600 1.2rem var(--ff-noto);
`;
