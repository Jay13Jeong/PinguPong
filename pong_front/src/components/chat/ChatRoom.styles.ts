import styled from "styled-components";
import { ContentBox } from "../../common/styles/ContentBox.style";
import { ChatFieldContainer } from "./ChatField.styles";

export const ChatRoomWrapper = styled(ContentBox)`
    display: grid;
    border: 1px solid #000000;
    width: 1000px;
    height: 600px; 
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 10fr 1fr 1fr 1fr;
    #duel-request-btn {
        grid-column: 1/2;
        grid-row: 2/3;
    }
    #change-pw-btn {
        grid-column: 1/2;
        grid-row: 3/4;
    }
    #exit-chat-btn {
        grid-column: 1/2;
        grid-row: 4/5;
    }
    #chat-field {
        grid-column: 2/3;
        grid-row: 1/4;
    }
    #chat-input {
        grid-column: 2/3;
        grid-row: 4/5;
        display: grid;
        grid-template-columns: 9fr 1fr;
        input {
            margin: 0.5rem;
        }
    }
`