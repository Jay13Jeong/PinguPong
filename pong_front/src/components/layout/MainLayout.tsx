import { Outlet } from "react-router-dom";
import BackGroundPingu from "../util/BackGroundPingu";
import Header from "../common/main/Header";
import styled from "styled-components";

export const MainLayoutWrapper = styled.div`
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
        <header></header>
        <MainLayoutWrapper>
            <Header/>
            <BackGroundPingu/>
            <Outlet/>
        </MainLayoutWrapper>
        <footer></footer>
        </>
    );
}

export default MainLayout;