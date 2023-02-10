import styled from "styled-components"

export const MainWrapper = styled.div`
  background-color: white;
  opacity: 70%;
  border-radius: 10px;
  width: fit-content;
  block-size: fit-content;
  padding: 10px;
  & button {
    background-color: skyblue;
    border-radius: 5px;
  }
  & button:hover {
    background-color: yellow;
    border-radius: 5px;
  }
`