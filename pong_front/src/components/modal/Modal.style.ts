import styled from 'styled-components'
import { ContentBox } from '../../common/styles/ContentBox.style'

export const OverLay = styled.div<{ z_index?: number }>`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: ${props => props.z_index || 200};
`

export const Wrapper = styled(ContentBox)`
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