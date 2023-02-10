import styled from "styled-components";
import { MainWrapper } from "../common/main/MainWrapper";
export const LobbyButtonsWrapper = styled(MainWrapper)`
    display: grid;
    grid-template-columns: repeat(2, 2fr);
    & button {
        min-width: 100px;
        font-size: 2rem;
    }
`