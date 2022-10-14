import styled from "styled-components";

const Footer = ({ footerBg }: { footerBg?: string }) => {
  return (
    <StyledFooter footerBg={footerBg}>
      <FooterText>
        Created by{" "}
        <b>
          <a
            href="https://github.com/Manthan-Kuber"
            target="_blank"
            rel="noopener noreferrer"
          >
            <u>Manthan Kuber</u>
          </a>
        </b>
        <b>
          {" "}
          &{" "}
          <a
            href="https://github.com/RohitShelkeBot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <u>Rohit Shelke</u>
          </a>
        </b>
      </FooterText>
    </StyledFooter>
  );
};

export default Footer;

export const StyledFooter = styled.footer<{ footerBg?: string }>`
  margin-top: auto;
  padding-block: 1.5rem;
  background-color: ${(props) => props.footerBg || "#f2f2f2"};

  /* @media (min-width: 55em) {
    padding-bottom: 2.4rem;
  } */
`;

export const FooterText = styled.p`
  font: 1.4rem var(--ff-montserrat);
  color: #bdbdbd;
  text-align: center;
`;
