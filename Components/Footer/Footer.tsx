import { StyledFooter, FooterText } from "./Footer.styles";

interface Props {}

const Footer = (props: Props) => {
  return (
    <StyledFooter>
      <FooterText>
        Created by <br />
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
