import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { AsideContainer } from "./FilterBox";

const Trends = ({ trendList, ...props }: TrendProps) => {
  return (
    <Article as="article" id="scrollableDiv">
      <h5>Trends for you</h5>
      <hr />
      <ul>
        <InfiniteScroll
          dataLength={trendList.length}
          next={props.getHashtags}
          hasMore={props.hasMore}
          loader={<p>Loading...</p>}
          scrollableTarget="scrollableDiv"
          endMessage={<p>You've reached the end</p>}
        >
          {trendList.map((item, index) => (
            <li key={`${item.id}${index}`}>
              <h3>{item.tagName}</h3>
              <span>{item.tweetCount}</span>
              <p>count {index + 1}</p>
            </li>
          ))}
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
