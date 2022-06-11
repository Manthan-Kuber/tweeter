import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Common/FullScreenLoader";
import Layout from "../../Components/Common/Layout";
import { useAppSelector } from "../../Hooks/store";

interface Props {}
function bookmarks({}: Props) {
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
        <Layout Tab="Bookmarks">
          <h1>bookmarks</h1>
        </Layout>
      )}
    </>
  );
}
export default bookmarks;
