import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../common/states/contextSocket';
import { useResetRecoilState, useRecoilValue } from 'recoil';
import { secretChatModalState } from '../../common/states/recoilModalState';
// import { Button } from '../../styles/Inputs';
import ModalBase from './ModalBase';
import { Stack } from '../../common/styles/Layout';
import './Chat.scss';

function SecretChatModal(props: {current: string}) {
    const showModal = useRecoilValue(secretChatModalState);
    const resetState = useResetRecoilState(secretChatModalState);
    const [values, setValues] = useState<string>("");
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        return (() => {
            resetState();
        })
    }, [resetState]);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // TODO - 비밀번호 보냄
        // socket.emit('/api/post/secretPW', {roomName: showModal.roomName, secret: values, userId: props.current});
        socket.emit('/api/post/secretPW', {roomName: showModal.roomName, secret: values});
        socket.on('/api/post/secretPW', (data) => {
            if (data) {
                // 입장 성공
                resetState();
                socket.off('/api/post/secretPW');
                navigate(`/chat/room/${showModal.roomName}`, {state: {
                    isMaster: false
                }});
            }
            else {
                toast.error("비밀번호가 틀렸습니다.");
                socket.off('/api/post/secretPW');
                setValues("");
            };
        })
    }

    if (showModal.show) {
        return (
            <ModalBase reset={resetState}>
                <Stack className="chat-form-wrapper">
                    <div className="title">비밀 채팅방 입장</div>
                    <form onSubmit={handler}>
                        <div className="wrapper">
                            <span>비밀번호</span>
                            <input type="password" autoComplete="off" placeholder="비밀번호" value={values} onChange={(e) => setValues(e.target.value)} />
                        </div>
                        <button type="submit">입장</button>
                    </form>
                </Stack>
            </ModalBase>
        );
    }
    return null;
}

export default SecretChatModal;