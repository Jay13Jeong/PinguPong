import { Outlet } from "react-router-dom";
import LoginLayoutWrapper from "./LoginLayout.style";

function LoginLayout() {
    return (
        <LoginLayoutWrapper>
            <Outlet/>
        </LoginLayoutWrapper>
    );
}

export default LoginLayout;