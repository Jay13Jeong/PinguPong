import { Outlet } from "react-router-dom";
import BackGroundPingu from "../util/BackGroundPingu";
import styled from "styled-components";

const LoginLayoutWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   justify-content: center;
   height: 100vh;
   overflow: hidden;
`

function LoginLayout() {
    return (
        <>
        <header></header>
        <LoginLayoutWrapper>
            <BackGroundPingu/>
            <Outlet/>
        </LoginLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default LoginLayout;