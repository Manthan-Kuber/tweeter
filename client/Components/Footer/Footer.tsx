import styled from "styled-components";

const Footer = () => {
  return (
    <StyledFooter>
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

export const StyledFooter = styled.footer`
  margin-top: auto;
  padding-top: 2.4rem;
  padding-bottom: 9.6rem;

  @media (min-width: 55em) {
    padding-bottom: 2.4rem;
  }
`;

export const FooterText = styled.p`
  font: 1.4rem var(--ff-montserrat);
  color: #bdbdbd;
  text-align: center;
`;
