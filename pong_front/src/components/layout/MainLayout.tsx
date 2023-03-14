import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainLayoutWrapper from "./MainLayout.style";
import CustomToastContainer from "../util/CustomToastContainer";
import { ProfileModal } from "../lobby/modal";
import OtherProfileModal from "../lobby/modal/OtherProfileModal";

function MainLayout() {
    return (
        <>
        <Header/>
        <CustomToastContainer/>
        <MainLayoutWrapper>
            <Outlet/>
            <ProfileModal/>
            <OtherProfileModal/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;