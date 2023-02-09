import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../../states/contextSocket"
import { useNavigate } from "react-router-dom";
import {CardButton} from "./Card";
import { useSetRecoilState } from "recoil";
import { secretChatModalState } from "../../../states/recoilModalState";
import { toast } from "react-toastify";

function ChatCardButton (props: {roomName: string, current: string}) {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setSecretChatModalState = useSetRecoilState(secretChatModalState);

    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        /* 비밀방 여부 확인 */
        socket.emit('/api/check/secret', props.roomName);
        socket.on('/api/check/secret', (data) => {
            if (data) {
                // socket.emit('getUser', {roomName: props.roomName, userId: props.current}) // NOTE - roomName만 보내기
                socket.emit('getUser', {roomName: props.roomName})
                /* ban 여부 확인 */
                socket.on('youBan', () => {
                    socket.off('youBan');
                    toast.error("금지당한 채팅방입니다!");
                })
                socket.on('youPass', () => {
                    navigate(`/chat/room/${props.roomName}`, {state: {
                        isMaster: false
                    }});
                })
            }
            else
                setSecretChatModalState({roomName: props.roomName, show: true});
        })
    };

    useEffect(() => {
        return (() => {
            socket.off('/api/check/secret');
            socket.off('youBan');
            socket.off('youPass');
        })
    })

    return (
        <CardButton onClick={clickHandler}>
            <span className="roomName">{props.roomName}</span>
        </CardButton>
    );
}

export default ChatCardButton;