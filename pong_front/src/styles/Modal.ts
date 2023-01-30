import styled from 'styled-components'

export const OverLay = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
`

export const Wrapper = styled.div`
    box-sizing: border-box;
    min-width: 700px;
    height: fit-content;
    padding: 20px;
    border-radius: 15px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .close-button {
        font-size: 20px;
        float: right;
    }
`