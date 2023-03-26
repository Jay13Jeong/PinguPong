import { Global } from "@emotion/react";

const styles = {
    cursor: "none !important",
    "*": {
        cursor: "none !important",
    },
    ".cursorPingu": {
        zIndex: "2147483647 !important",
    },
}

const GlobalStyle = () => {
    return (
        <Global styles={styles} />
    )
}

export default GlobalStyle;