import styled, { css } from "styled-components";

const profileBox = css `
    width: 90px;
    height: 90px;
    border-radius: 30%;
    overflow: hidden;
`

export const ProfileModalWrapper = styled.div`
    box-sizing: content-box;
    display: grid;
    row-gap: 10px;
    font-size: 1.5rem;
    place-items: center;
    grid-template-columns: repeat(2, minmax(350px, 350px));
    grid-template-rows: 90px, 30px, 30px, 30px;
    row-gap: 10px;
    & .profile-box {
        ${profileBox}
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    & .profile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    & .profile-button-wrapper {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
    }
    & .profile-button {
        margin: 5px;
        font-size: 1.1rem;
        width: fit-content;
        height: fit-content;
    }
    & .profile-name {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    & .profile-status {
        font-size: 1.5rem;
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }
    & .profile-rank {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
    }
    & .profile-odds {
        grid-column: 2 / 3;
        grid-row: 3 / 4;
    }
    & .record-title {
        text-align: center;
        border-top: 2px solid #000;
        grid-column: 1 / 3;
        grid-row: 4 / 5;
    }
`