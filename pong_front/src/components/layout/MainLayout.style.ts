import styled from "@emotion/styled";
import { pingu1, pingu2, pingu3, pingu4, pingu5, pingu6, pingu7, pingu8 } from "../../assets/background";

function randomNum(){
    const max = 8; //마지막 이미지 번호.
    const min = 1; //최초 이미지 번호.
    return Math.floor(Math.random() * (max - min) + min);
  }

const backgrounds = [pingu1, pingu2, pingu3, pingu4, pingu5, pingu6, pingu7, pingu8];

const backgroundImg = backgrounds[randomNum()];

const MainLayoutWrapper = styled.div`
   position: fixed;
   top: 50px; 
   background-image: url(${backgroundImg});
   margin:0px;
   width:100vw;
   background-size: cover;
   background-repeat: no-repeat;
   display: flex;
   justify-content: center;
   align-items: center;
   height: calc(100vh - 50px);
   overflow: hidden;
`
export default MainLayoutWrapper;