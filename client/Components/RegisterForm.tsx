import { Dispatch, SetStateAction } from "react";
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
  placeholder1:string;
  placeholder2:string;
}
const LoginForm = ({visible,setVisible,setformValues,formValues,placeholder1,placeholder2}: Props) => {
  return (
    <>
      <Input
        formValues={formValues}
        setformValues={setformValues}
        value={formValues.email}
        name="email"
        icon="MdEmail"
        placeholder={placeholder1}
        type="text"
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
      />
      <Button type="submit">Sign In</Button>
    </>
  );
};
export default LoginForm;
