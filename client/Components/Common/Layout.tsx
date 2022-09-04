import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Head from "next/head";
import { FaCompass } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../Hooks/store";
import FullScreenLoader from "./FullScreenLoader";
import { logOut } from "../../features/auth/authSlice";
import axiosApi from "../../app/services/axiosApi";

const NavList = [
  { id: 1, name: "Home", url: "/", icon: <AiFillHome size={24} /> },
  // { id: 2, name: "Explore", url: "/explore", icon: <FaCompass size={24} /> },
  {
    id: 3,
    name: "Bookmarks",
    url: "/bookmarks",
    icon: <BsFillBookmarkFill size={24} />,
  },
];

function Layout({ children }: { children: React.ReactElement }) {
  const router = useRouter();
  const username = useAppSelector((state) => state.auth.user?.username);
  const [activeTab, setActiveTab] = useState(router.route);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      setIsLoading((prev) => !prev);
      async () => await axiosApi.get("clearcookie");
      dispatch(logOut());
      router.replace("/register");
    } else if (token) {
      setIsLoading(false);
    }
  }, [token]);

  if (!token) return <FullScreenLoader />;

  return (
    <>
      <Head>
        <title>
          {router.route === "/"
            ? "Home"
            : router.route === "/[userId]"
            ? `${username}`
            : router.route.split("/")[1].charAt(0).toUpperCase() +
              router.route.split("/")[1].substring(1)}{" "}
          / Tweeter
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header
        NavList={NavList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
export default Layout;

const Main = styled.main`
  min-height: calc(100vh - 13rem);
  background-color: #f2f2f2;
  padding-bottom: 2rem;
`;
