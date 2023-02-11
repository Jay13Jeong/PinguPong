import styled from "styled-components";
import pingaDoor from "../../assets/pinga-door.gif";

const LoginLayoutWrapper = styled.div`
    background-image: url(${pingaDoor});
    margin:0px;
    width:100vw;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    cursor: none !important;
    * {
        cursor: none !important;
    }
    .cursorPingu {
        z-index: 2147483647 !important;
    }
`

export default LoginLayoutWrapper;