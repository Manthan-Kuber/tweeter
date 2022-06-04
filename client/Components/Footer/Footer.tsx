import { StyledFooter, FooterText } from "./Footer.styles";


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
