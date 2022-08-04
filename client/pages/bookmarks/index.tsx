import styled from "styled-components";
import { useGetBookmarksQuery } from "../../app/services/api";

function Bookmarks() {
  const {data} = useGetBookmarksQuery(0);
  console.log(data);


  return <Container>Bookmarks</Container>;
}

export default Bookmarks;

const Container = styled.div`
  width: min(95%, 60rem);
  margin-inline: auto;
  padding-block: 2rem;
`;
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const token = ctx.req.cookies.jwt;
//   const response = await axiosApi.get("/home/bookmarks/100",{
//     headers:{
//       authorization:`Bearer ${token}`
//     }
//   })
//   console.log(response.data);
//   return {
//     props: {},
//   };
// };
