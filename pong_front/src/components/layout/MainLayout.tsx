import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainLayoutWrapper from "./MainLayout.style";
import CustomToastContainer from "../util/CustomToastContainer";

function MainLayout() {
    return (
        <>
        <Header/>
        <CustomToastContainer/>
        <MainLayoutWrapper>
            <Outlet/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;