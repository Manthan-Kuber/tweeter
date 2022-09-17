import { useEffect, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import styled from "styled-components";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    if (document.documentElement.scrollTop > 300) {
      setVisible(true);
    } else if (document.documentElement.scrollTop <= 300) {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, [document.documentElement.scrollTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ScrollBtn onClick={scrollToTop} visible={visible}>
      <AiOutlineArrowUp size={30} />
    </ScrollBtn>
  );
};
export default ScrollToTopButton;

const ScrollBtn = styled.button<{ visible: boolean }>`
  cursor: pointer;
  position: fixed;
  bottom: 6rem;
  right: 3rem;
  display: ${(props) => (props.visible ? "inline-block" : "none")};
  background-color: var(--clr-primary);
  border: none;
  color: white;
  z-index: 2;
  border-radius: 50%;
  padding: 0.75rem;

  @media screen and (min-width: 55em) {
    bottom: 3rem;
  }
`;
