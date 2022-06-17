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
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  color: var(--clr-primary);
`;

const spin = keyframes`
    from{transform:rotate(0deg)};
    to{transform:rotate(360deg)};
`;

const Loader = styled(CgSpinner)`
  animation: 0.5s ${spin} infinite linear;
`;
