import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import ContentLoader from "./ContentLoader";
import { AsideContainer } from "./FilterBox";
import NoTweetsToShow from "./NoTweetsToShow";

const Trends = ({ trendList, ...props }: TrendProps) => {
  useEffect(() => {
    if (trendList?.length === 6) props.setHasMoreTrends(true);
  }, [trendList]);
  return (
    <Article as="article" id="trendScroll">
      <h3>Trends for you</h3>
      <hr />
      <ul>
        {trendList !== undefined ? (
          <InfiniteScroll
            dataLength={trendList.length}
            next={props.getHashtags}
            hasMore={props.hasMore}
            loader={<ContentLoader />}
            scrollableTarget="trendScroll"
            scrollThreshold={0.95}
          >
            {trendList.length === 0 ? (
              <NoTweetsToShow message={"No More Trends to show"} />
            ) : (
              trendList.map((item, index) => (
                // Add onclick function later if req
                <li key={`${item._id}${index}`}>
                  <h3>{item.hashtag}</h3>
                  <span>{`${item.tweets} ${
                    item.tweets > 1 ? "tweets" : "tweet"
                  }`}</span>
                </li>
              ))
            )}
          </InfiniteScroll>
        ) : (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <li key={index}>
                <h3>
                  <Skeleton />
                </h3>
                <span>
                  <Skeleton />
                </span>
              </li>
            ))
        )}
      </ul>
    </Article>
  );
};
export default Trends;

const Article = styled(AsideContainer)`
  padding: 1rem;
  margin-bottom: 2rem;
  color: #4f4f4f;
  max-height: 45rem;
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
  & > h3 {
    color: #333;
    font: revert;
  }
  span {
    color: #828282;
    font: 500 1.2rem;
  }
`;
