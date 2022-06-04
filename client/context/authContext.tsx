import { createContext, ReactElement, useState } from "react";

interface AuthContextInterface {
  isUserAuthenticated: () => false | undefined;
  setAuthState: (UserAuthInfo: any) => void;
  authState: {
    token: string;
  };
}

const AuthContext = createContext<AuthContextInterface | null>(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [authState, setAuthState] = useState({
    token: "",
  });

  const setUserAuthInfo = ({ data }: any) => {
    const token = localStorage.setItem("token", data.data);

    setAuthState({ token: token! });
  };

  const isUserAuthenticated = () => {
    if (!authState.token) return false;
  };

  return (
    <Provider
      value={{
        authState,
        isUserAuthenticated,
        setAuthState: (UserAuthInfo: any) => setUserAuthInfo(UserAuthInfo),
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
