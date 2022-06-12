interface User {
  id: string;
  name: string;
  email: string;
}

interface authState {
  user: User | null;
  token: string | null;
}

interface UserResponse {
  user: User;
  token: string;
}

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

interface InputGroupProps {
  placeholder?: string;
  icon?: string;
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string;
  name: string;
  value: string;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      fname: string;
      lname: string;
      email: string;
      password: string;
    }>
  >;
  formValues: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  };
  myRef?: React.RefObject<HTMLInputElement>;
}

interface RegisterFormProps {
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setformValues: React.Dispatch<
    React.SetStateAction<{
      fname: string;
      lname: string;
      email: string;
      password: string;
    }>
  >;
  formValues: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  };
  emailPlaceholder: string;
  passwordPlaceholder: string;
  btnText: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  errMessage: {
    name: string;
    email: string;
    password: string;
  };
  isSignupForm?: boolean;
}

interface NavProps {
  NavList: {
    id: number;
    name: string;
    url: string;
    icon: JSX.Element;
  }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  width?: number;
  Tab?: string;
}
