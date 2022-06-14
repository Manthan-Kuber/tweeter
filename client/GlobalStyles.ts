import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root{
  --clr-primary:#2F80ED;
  --clr-gray:#828282;
  --ff-montserrat:'Montserrat', sans-serif;
  --ff-poppins:"Poppins",sans-serif;
  --ff-noto:"Noto Sans",sans-serif;
}
*,*::before,*::after{
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
html{
    font-size: 62.5%;
    height:100%;
}
body{
  height: 100%;
}

a{
  color: inherit;
  text-decoration: inherit;
}

li{
  list-style: none;
}

`;

export default GlobalStyles;
