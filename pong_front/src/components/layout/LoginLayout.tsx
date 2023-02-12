import { Outlet } from "react-router-dom";
import LoginLayoutWrapper from "./LoginLayout.style";
// import Cursor from "../util/Cursor";

function LoginLayout() {
    return (
        <>
        <LoginLayoutWrapper>
            {/* <Cursor/> */}
            <Outlet/>
        </LoginLayoutWrapper>
        </>
    );
}

export default LoginLayout;