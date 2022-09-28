import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import GlobalStyles from "../GlobalStyles";
import { NextPage } from "next";
import { store, persistor } from "../app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "../Components/Common/Layout";
import FullScreenLoader from "../Components/Common/FullScreenLoader";
import NextNProgress from "nextjs-progressbar";
import 'react-loading-skeleton/dist/skeleton.css'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <Provider store={store}>
        <GlobalStyles />
        <NextNProgress color="var(--clr-primary)" showOnShallow={false} options={{showSpinner:false}} />
        <PersistGate persistor={persistor}>
          <Layout>{page}</Layout>
        </PersistGate>
      </Provider>
    ));
  return getLayout(
    <Provider store={store}>
      <GlobalStyles />
      <NextNProgress color="var(--clr-primary)" showOnShallow={false} options={{showSpinner:false}} />
      <PersistGate persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
