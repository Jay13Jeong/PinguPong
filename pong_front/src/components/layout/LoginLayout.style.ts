import { Box, styled } from "@mui/material";
import pingaDoor from "../../assets/pinga-door.gif";

const LoginLayoutWrapper = styled(Box)`
    background-image: url(${pingaDoor});
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default LoginLayoutWrapper;