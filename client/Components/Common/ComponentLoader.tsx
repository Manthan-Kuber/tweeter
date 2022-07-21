import ContentLoader from "react-content-loader";
import styled from "styled-components";

const ComponentLoader = ({
  width,
  height,
  borderRadius,
  ...props
}: ComponentLoaderProps) => (
  <Wrapper>
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx={borderRadius} ry={borderRadius} width="100%" height="100%" />
    </ContentLoader>
  </Wrapper>
);

export default ComponentLoader;

const Wrapper = styled.div`
  border-radius: 8px;
`;
