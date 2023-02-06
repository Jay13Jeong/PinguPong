import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../../states/contextSocket"
import { useNavigate } from "react-router-dom";
import {CardButton} from "./Card";
import { useSetRecoilState } from "recoil";
import { secretChatModalState } from "../../../states/recoilModalState";

function ChatCardButton (props: {roomName: string, current: string}) {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setSecretChatModalState = useSetRecoilState(secretChatModalState);

    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        // TODO - 입장 요청 보내주기
        socket.emit('/api/check/secret', props.roomName);
        socket.on('/api/check/secret', (data) => {
            if (data) {
                socket.emit('getUser', {roomName: props.roomName, userId: props.current})
                navigate(`/chat/room/${props.roomName}`, {state: {
                    isMaster: false
                }});
            }
            // TODO - 비밀방 모달 띄우기
            setSecretChatModalState({roomName: props.roomName, show: true});
        })
    };

    useEffect(() => {
        return (() => {
            socket.off('/api/check/secret');
        })
    })

    return (
        <CardButton onClick={clickHandler}>
            <span className="roomName">{props.roomName}</span>
        </CardButton>
    );
}

export default ChatCardButton;