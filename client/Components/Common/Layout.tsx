import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Head from "next/head";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAppSelector } from "../../Hooks/store";

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
  const [activeTab, setActiveTab] = useState(Tab!);
  const { push } = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  // useEffect(() => {
  //   token ? push("/") : push("/register");
  // }, [token]);
  return (
    <>
      <Head>
        <title>Tweeter - {Tab}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header
        NavList={NavList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Main
        as={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </Main>
      <Footer />
    </>
  );
}
export default Layout;

const Main = styled.main`
  min-height: calc(100vh - 14rem);
`;
