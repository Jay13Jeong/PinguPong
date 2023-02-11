import styled from "styled-components";

const LoaderWrapper = styled.div `
    display: grid;
    grid-template-rows: repeat(2, minmax(auto, auto));
    gap: 20px;
    .msg {
        font-weight: bold;
        margin: auto;
        grid-row: 1;
    }
`;

export default LoaderWrapper;