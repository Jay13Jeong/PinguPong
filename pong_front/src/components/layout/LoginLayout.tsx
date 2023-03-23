import { Outlet } from "react-router-dom";
import CustomToastContainer from "../util/CustomToastContainer";
import LoginLayoutWrapper from "./LoginLayout.style";

function LoginLayout() {
    return (
        <>
        <CustomToastContainer/>
        <LoginLayoutWrapper>
            <Outlet/>
        </LoginLayoutWrapper>
        </>
    );
}

export default LoginLayout;