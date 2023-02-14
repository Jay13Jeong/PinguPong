import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../../common/states/contextSocket"
import { useNavigate } from "react-router-dom";
import {CardButton} from "../Card.style";
import { useSetRecoilState } from "recoil";
import { secretChatModalState } from "../../../common/states/recoilModalState";
import { toast } from "react-toastify";

function ChatCardButton (props: {roomName: string, current: string}) {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setSecretChatModalState = useSetRecoilState(secretChatModalState);

    useEffect(() => {
        return (() => {
            socket.off('/api/check/secret');
            socket.off('youBan');
            socket.off('youPass');
        })
    }, [socket]);

    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        /* 비밀방 여부 확인 */
        socket.emit('/api/check/secret', props.roomName);
        socket.on('/api/check/secret', (data) => {
            socket.off('/api/check/secret');
            if (data) {
                socket.emit('getUser', {roomName: props.roomName})
                /* ban 여부 확인 */
                socket.on('youBan', () => {
                    socket.off('youBan');
                    toast.error("금지당한 채팅방입니다!");
                })
                socket.on('notRoom', () => {
                    socket.off('notRoom');
                    toast.error("존재하지 않는 채팅방입니다!");
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

    return (
        <CardButton onClick={clickHandler}>
            <span className="roomName">{props.roomName}</span>
        </CardButton>
    );
}

export default ChatCardButton;