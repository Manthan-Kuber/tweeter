import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import GlobalStyles from "../GlobalStyles";
import { NextPage } from "next";
import { store,persistor } from "../app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <GlobalStyles />
        <Component {...pageProps} />
      </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
