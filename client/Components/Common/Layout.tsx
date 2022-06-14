import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Head from "next/head";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

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

function Layout({ children }: { children: React.ReactElement }) {
  const router = useRouter();
  const pathName =
    router.pathname.split("/")[1].toUpperCase()[0] +
    router.pathname.split("/")[1].substring(1);
  const [activeTab, setActiveTab] = useState(
    router.pathname.split("/")[1] === "" ? "Home" : pathName
  );

  return (
    <>
      <Head>
        <title>
          Tweeter - {router.pathname.split("/")[1] === "" ? "Home" : pathName}{" "}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {pathName !== "Register" && (
        <Header
          NavList={NavList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
export default Layout;

const Main = styled.main`
  min-height: calc(100vh - 13rem);
  background-color: #f2f2f2;
  padding-block: 2rem;
`;
