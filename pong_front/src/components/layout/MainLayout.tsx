import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainLayoutWrapper from "./MainLayout.style";
import CustomToastContainer from "../util/CustomToastContainer";
import { ProfileModal } from "../lobby/modal";


function MainLayout() {
    return (
        <>
        <Header/>
        <CustomToastContainer/>
        <MainLayoutWrapper>
            <ProfileModal/>
            <Outlet/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;