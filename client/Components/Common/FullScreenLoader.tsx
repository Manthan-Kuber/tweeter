import styled, { keyframes } from "styled-components";
import { CgSpinnerTwoAlt } from "react-icons/cg";

interface Props {}
const FullScreenLoader = (props: Props) => {
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

const Loader = styled(CgSpinnerTwoAlt)`
  animation: 0.5s ${spin} infinite linear;
`;
