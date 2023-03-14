import styled from "styled-components";
import { ContentBox } from "../../common/styles/ContentBox.style";
export const MenuButtonsWrapper = styled(ContentBox)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    border-bottom: 1px solid black;
    & button {
        margin: 10px;
        padding: 10px;
        background: none;
    }
`