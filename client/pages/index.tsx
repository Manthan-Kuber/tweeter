import styled from "styled-components";
import CreateTweet from "../Components/Common/CreateTweet";
import SuggestedFollow from "../Components/Common/SuggestedFollow";
import Trends from "../Components/Common/Trends";

const Home = () => {
  const trendList = [
    { id: 0, tagName: "#programming", tweetCount: "213k Tweets" },
    { id: 1, tagName: "#devchallenges", tweetCount: "123k Tweets" },
    { id: 2, tagName: "#frontend", tweetCount: "69k Tweets" },
    { id: 3, tagName: "#backend", tweetCount: "55k Tweets" },
    { id: 4, tagName: "#69DaysOfCode", tweetCount: "25k Tweets" },
    { id: 5, tagName: "#johhnydepp", tweetCount: "5k Tweets" },
  ];

  return (
    <Container>
      <div>
        <CreateTweet isReplyImageVisible={false} placeholder="Whats happening?" btnText="Tweet" variant="Home"/>
      </div>
      <aside>
        <Trends trendList={trendList} />
        <SuggestedFollow />
      </aside>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: min(95%, 120rem);
  margin-inline: auto;
  padding-block: 2rem;
  gap: 2rem;
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: 25em) {
    aside {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media screen and (min-width: 40em) {
    aside {
      padding-inline: 5rem;
    }
  }

  @media screen and (min-width: 55em) {
    display: grid;
    grid-template-columns: 3fr 1fr;
    aside {
      padding-inline: revert;
      display: revert;
    }
  }
`;
