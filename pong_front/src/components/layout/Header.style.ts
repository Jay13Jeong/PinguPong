import styled from "@emotion/styled";

export const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #f6f6f8;
    display: inline-flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding: 5px;
    width: 100%;
    .navi-title {
        display: flex;
        align-items: center;
        img {
            width: auto;
            height: 40px;
        }
        span {
            vertical-align: middle;
            font-size: 2.5rem;
            font-weight: bold;
            font-family: "Jua", sans-serif;
            color: #000000;
        }
    }
`;