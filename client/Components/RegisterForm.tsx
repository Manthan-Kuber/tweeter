import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "../pages/register";
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    url: string
  ) => Promise<void>;
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
}: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emailRef.current) throw Error("emailRef is not assigned");
    emailRef.current.focus();
  }, []);

  const url =
    btnText === "Sign Up"
      ? "http://localhost:6969/signup"
      : "http://localhost:6969/login";

  return (
    <form>
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
      <Button onClick={(e) => handleSubmit(e, url)}>{btnText}</Button>
    </form>
  );
};
export default RegisterForm;
