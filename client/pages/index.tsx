import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FullScreenLoader from "../Components/Common/FullScreenLoader";
import Layout from "../Components/Common/Layout";
import { useAppSelector } from "../Hooks/store";

const Home: NextPage = () => {
  const name = useAppSelector((state) => state.auth.user?.name)
  const token = useAppSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter();

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setIsLoading((prev) => !prev);
      }, 1500);
      replace("/register");
    } else if (token) {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Layout Tab="Home">
          <h1>{`Welcome home ${name}`}</h1>
        </Layout>
      )}
    </>
  );
};

export default Home;
