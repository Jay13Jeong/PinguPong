import styled from "styled-components";
import { ContentBox } from "../../common/styles/ContentBox.style";
export const LobbyButtonsWrapper = styled(ContentBox)`
    display: grid;
    grid-template-columns: repeat(2, 2fr);
    & button {
        min-width: 100px;
        font-size: 2rem;
    }
`