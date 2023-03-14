import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../../common/states/contextSocket';
import { useResetRecoilState, useRecoilValue } from 'recoil';
import { secretChatModalState } from '../../../common/states/recoilModalState';
import ModalBase from '../../modal/ModalBase';
import { Stack } from '../../../common/styles/Stack.style';
import { InputTextWrapper } from '../../../common/styles/InputTextWrapper.style';

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
        // socket.emit('chatPostSecretPW', {roomName: showModal.roomName, secret: values, userId: props.current});
        socket.emit('chatPostSecretPW', {roomName: showModal.roomName, secret: values});
        socket.on('chatPostSecretPW', (data) => {
            if (data) {
                // 입장 성공
                resetState();
                socket.off('chatPostSecretPW');
                navigate(`/chat/room/${showModal.roomName}`, {state: {
                    isMaster: false
                }});
            }
            else {
                toast.error("비밀번호가 틀렸습니다.");
                socket.off('chatPostSecretPW');
                setValues("");
            };
        })
    }

    if (showModal.show) {
        return (
            <ModalBase reset={resetState}>
                <Stack>
                    <h1>비밀 채팅방 입장</h1>
                    <form onSubmit={handler}>
                        <InputTextWrapper>
                            <span>비밀번호</span>
                            <input type="password" autoComplete="off" placeholder="비밀번호" value={values} onChange={(e) => setValues(e.target.value)} />
                        </InputTextWrapper>
                        <button type="submit">입장</button>
                    </form>
                </Stack>
            </ModalBase>
        );
    }
    return null;
}

export default SecretChatModal;