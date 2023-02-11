import styled from "styled-components"

export const ContentBox = styled.div`
  /* background-color:rgba(255, 255, 255, 0.7); */
  background-color:rgba(255, 255, 255);
  border-radius: 10px;
  width: fit-content;
  block-size: fit-content;
  padding: 10px;
  & button {
    border: 1px solid black;
    background-color: skyblue;
    border-radius: 5px;
  }
  & button:hover {
    background-color: yellow;
    border-radius: 5px;
  }
`