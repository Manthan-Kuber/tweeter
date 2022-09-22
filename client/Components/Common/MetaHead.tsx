import Head from "next/head";

const MetaHead = ({ currentRouteName, pathname }: MetaHeadProps) => {
  return (
    <Head>
      <title>{currentRouteName} / Tweeter</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="title" content={`Tweeter - ${currentRouteName}`} />
      <meta
        name="description"
        content="A Social Media App created by Manthan Kuber and Rohit Shelke ⚡."
      />

      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://tweeter-self.vercel.app${pathname}`}
      />
      <meta property="og:title" content={`Tweeter — ${currentRouteName}`} />
      <meta
        property="og:description"
        content="A Social Media App created by Manthan Kuber and Rohit Shelke ⚡."
      />
      <meta property="og:image" content="%PUBLIC_URL%/favicon.ico" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content={`https://tweeter-self.vercel.app${pathname}`}
      />
      <meta
        property="twitter:title"
        content={`Tweeter — ${currentRouteName}`}
      />
      <meta
        property="twitter:description"
        content="A Social Media App created by Manthan Kuber and Rohit Shelke ⚡."
      />
      <meta property="twitter:image" content="%PUBLIC_URL%/favicon.ico" />
    </Head>
  );
};
export default MetaHead;
