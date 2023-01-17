import styled from 'styled-components';

interface buttonProps {
    primary?: boolean;
}

export const Button = styled.button<buttonProps>`
    background: ${(props) => props.primary ? "black" : "lightGray"};
    color: ${(props) => props.primary ? "lightGray" : "black"};
    border: none;
    border-radius: 5px;
    margin: 10px;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    &:hover {
        background: ${(props) => props.primary ? "teal" : "teal"};
    }
`;
