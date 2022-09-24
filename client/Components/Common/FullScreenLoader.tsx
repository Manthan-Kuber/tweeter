import styled, { keyframes } from "styled-components";
import { CgSpinner } from "react-icons/cg";

const FullScreenLoader = () => {
  return (
    <Wrapper>
      <Loader size={48} />
    </Wrapper>
  );
};
export default FullScreenLoader;

const Wrapper = styled.div`
  height: calc(100vh - 4.8rem);
  width: 100%;
  display: grid;
  place-items: center;
  color: var(--clr-primary);
`;

const spin = keyframes`
    from{transform:rotate(0deg)};
    to{transform:rotate(360deg)};
`;

export const Loader = styled(CgSpinner)`
  animation: 0.5s ${spin} infinite linear;
`;
