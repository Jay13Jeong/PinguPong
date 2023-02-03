import styled from "styled-components";

export const ChatFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-height: 360px;
    max-height: 600px;
    overflow: auto;
`;

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  &.my_message {
    align-self: flex-end;
    .message {
      background: yellow;
      align-self: flex-end;
    }
  }
`;

export const Message = styled.span`
  margin-bottom: 0.5rem;
  background: #fff;
  width: fit-content;
  padding: 12px;
  border-radius: 0.5rem;
`;