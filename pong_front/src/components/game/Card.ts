import styled, {css} from "styled-components";

const CardBase = css`
    display: flex;
    align-items: center;
    text-align: center;
    padding: 10px;
    margin: 5px 0 5px 0;
    width: 500px;
    height: fit-content;
    border: 2px solid #393e46;
    border-radius: 15px;
    font-size: 1.5rem;
    .player {
        min-width: 400px;
    }
    .score {
        min-width: 100px;
    }
`

export const Card = styled.div`
    ${CardBase}
`

export const CardButton = styled.button`
    ${CardBase}
    box-sizing: content-box;
    cursor: pointer;
    &:hover {
        border: 2px solid #00adb5;
        background-color: #00adb5;
    }
`