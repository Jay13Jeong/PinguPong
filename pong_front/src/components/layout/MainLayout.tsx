import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainLayoutWrapper from "./MainLayout.style";

function MainLayout() {
    return (
        <>
        <Header/>
        <MainLayoutWrapper>
            <Outlet/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;