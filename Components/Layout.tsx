import GlobalStyles from "../GlobalStyles";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Head from "next/head";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";

const NavList = [
  { id: 1, name: "Home", url: "/", icon: <AiFillHome size={24} /> },
  { id: 2, name: "Explore", url: "/explore", icon: <FaCompass size={24} /> },
  {
    id: 3,
    name: "Bookmarks",
    url: "/bookmarks",
    icon: <BsFillBookmarkFill size={24} />,
  },
];

function Layout({
  children,
  Tab,
}: {
  children: React.ReactElement;
  Tab?: string;
}) {
  console.log(Tab);
  const [activeTab, setActiveTab] = useState(Tab!);
  return (
    <>
      <Head>
        <title>Tweeter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyles />
      <Header
        NavList={NavList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
export default Layout;
