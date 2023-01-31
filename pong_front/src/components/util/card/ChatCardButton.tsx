import React from "react";
import { useNavigate } from "react-router-dom";
import {CardButton} from "./Card";

// TODO - props 명확히 하기
function ChatCardButton (props: {roomName: string, id?: string}) {
    const navigate = useNavigate();

    function clickHandler(e: any) {
        // TODO - 입장 요청 보내주기
        navigate(`/chat/room/${props.id}`);
    };

    return (
        <CardButton onClick={clickHandler}>
            <span className="roomName">{props.roomName}</span>
        </CardButton>
    );
}

export default ChatCardButton;