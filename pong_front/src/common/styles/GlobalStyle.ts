import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  cursor: none !important;
    * {
        cursor: none !important;
    }
    .cursorPingu {
        z-index: 2147483647 !important;
    }
`;

export default GlobalStyle;