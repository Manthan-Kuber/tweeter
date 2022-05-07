import type { AppProps } from "next/app";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";
import GlobalStyles from "../GlobalStyles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
