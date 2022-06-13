import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Footer = () => {
  const {pathname} = useRouter();
  const [isBgWhite, setIsBgWhite] = useState(false)

  useEffect(() => {
    if(pathname === "/register") setIsBgWhite(true)
    console.log(isBgWhite);
  }, [])
  

  return (
    <StyledFooter isBgWhite={isBgWhite}>
      <FooterText>
        Created by{" "}
        <b>
          <u>Manthan Kuber</u>
        </b>
        <b>
          {" "}
          & <u>Rohit Shelke</u>
        </b>
      </FooterText>
    </StyledFooter>
  );
};

export default Footer;

export const StyledFooter = styled.footer<{ isBgWhite: boolean }>`
  margin-top: auto;
  padding-top: 2.4rem;
  padding-bottom: 9.6rem;
  background-color: ${(props) => (props.isBgWhite ? "white" : "#f2f2f2")};

  @media (min-width: 55em) {
    padding-bottom: 2.4rem;
  }
`;

export const FooterText = styled.p`
  font: 1.4rem var(--ff-montserrat);
  color: #bdbdbd;
  text-align: center;
`;
