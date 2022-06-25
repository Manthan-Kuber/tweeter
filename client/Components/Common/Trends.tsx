import styled from "styled-components";
import { AsideContainer } from "./FilterBox";

const Trends = ({ trendList }: TrendProps) => {
  return (
    <Article as="article">
      <h5>Trends for you</h5>
      <hr />
      <ul>
        {trendList.map((item) => (
          <li key={item.id}>
            <h3>{item.tagName}</h3>
            <span>{item.tweetCount}</span>
          </li>
        ))}
      </ul>
    </Article>
  );
};
export default Trends;

const Article = styled(AsideContainer)`
  padding: 1rem;
  margin-bottom: 2rem;
  color: #4f4f4f;
  max-width: 30rem;
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
