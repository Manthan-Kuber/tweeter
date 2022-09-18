import { LoaderWrapper } from "../../pages/tweet/[tweetId]";
import { Loader } from "./FullScreenLoader";

const ContentLoader = ({
  size = 16,
  color = "var(--clr-primary)",
}: ContentLoaderProps) => {
  return (
    <LoaderWrapper>
      <Loader size={size} color={color} />
    </LoaderWrapper>
  );
};
export default ContentLoader;
