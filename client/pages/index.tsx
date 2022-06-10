import type { NextPage } from "next";
import Layout from "../Components/Common/Layout";
import { useAppSelector } from "../Hooks/store";

const Home: NextPage = () => {
  const email = useAppSelector((state) => state.auth.user?.email)
  return (
    <Layout Tab="Home">
      <h1>{`Welcome home ${email}`}</h1>
    </Layout>
  );
};

export default Home;
