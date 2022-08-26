import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { AsideContainer } from "./FilterBox";
import NoTweetsToShow from "./NoTweetsToShow";

const Trends = ({ trendList, ...props }: TrendProps) => {
  useEffect(() => {
    if (trendList.length === 6) props.setHasMoreTrends(true);
  }, [trendList]);
  return (
    <Article as="article" id="trendScroll">
      <h5>Trends for you</h5>
      <hr />
      <ul>
        <InfiniteScroll
          dataLength={trendList.length}
          next={props.getHashtags}
          hasMore={props.hasMore}
          loader={<p>Loading...</p>} //Change Later
          scrollableTarget="trendScroll"
          endMessage={trendList.length !== 0 && <p>You have reached the end...</p>} //Change Later
        >
          {trendList.length === 0 ? (
            <NoTweetsToShow message={"No More Trends to show"} />
          ) : (
            trendList.map((item, index) => (
              // Add onclick function later if req
              <li key={`${item.id}${index}`}>
                <h3>{item.tagName}</h3>
                <span>{`${item.tweetCount} ${
                  parseInt(item.tweetCount) > 1 ? "tweets" : "tweet"
                }`}</span>
              </li>
            ))
          )}
        </InfiniteScroll>
      </ul>
    </Article>
  );
};
export default Trends;

const Article = styled(AsideContainer)`
  padding: 1rem;
  margin-bottom: 2rem;
  color: #4f4f4f;
  max-height: 52rem;
  overflow-y: scroll;
  hr {
    margin-block: 1rem 2.5rem;
    color: hsla(0, 0%, 88%, 1);
  }
  li {
    margin-bottom: 2.5rem;
  }
  h3 {
    font: 600 1.6rem var(--ff-noto);
    color: #333;
    margin-bottom: 1rem;
    letter-spacing: -0.035em;
  }
  span {
    color: #828282;
    font: 500 1.2rem;
  }
`;
