import { Outlet } from "react-router-dom";
import styled from "styled-components";
import BackGroundPingu from "../util/BackGroundPingu";
import Header from "./Header";

const MainLayoutWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   justify-content: center;
   height: calc(100vh - 50px);
   overflow: hidden;
`

function MainLayout() {
    return (
        <>
        <Header/>
        <MainLayoutWrapper>
            {/* <BackGroundPingu/> */}
            <Outlet/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;