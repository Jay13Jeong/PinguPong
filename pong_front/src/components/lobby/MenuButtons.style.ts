import styled from "styled-components";
import { MainWrapper } from "../../common/main/MainWrapper";
export const MenuButtonsWrapper = styled(MainWrapper)`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-bottom: 1px solid black;
    & button {
        margin: 10px;
        padding: 10px;
        background: none;
    }
`