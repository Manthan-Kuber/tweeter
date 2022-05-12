import { ReactElement } from "react";
import Footer from "../../Components/Footer/Footer";
import GlobalStyles from "../../GlobalStyles";

interface Props {}
function SignUp({}: Props) {
  return <div>SignUp</div>;
}

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <GlobalStyles />
      {page}
      <Footer />
    </>
  );
};

export default SignUp;
