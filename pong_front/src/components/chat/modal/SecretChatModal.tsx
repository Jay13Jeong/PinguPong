import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../../common/states/contextSocket';
import { useResetRecoilState, useRecoilValue } from 'recoil';
import { secretChatModalState } from '../../../common/states/recoilModalState';
import ModalBase from '../../modal/ModalBase';
import { Typography, TextField, Stack } from '@mui/material';
import { DefaultButton } from '../../common';

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

    return (
        <ModalBase open={showModal.show} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h3" gutterBottom sx={{marginLeft: "3rem", marginRight: "3rem"}}>비밀 채팅방 입장</Typography>
                <form style={{width: "100%"}} onSubmit={handler}>
                        <Stack spacing={1} >
                            <TextField fullWidth size="small"
                                label="비밀번호"
                                onChange={(e) => setValues(e.target.value)}
                                value={values}
                                variant="standard"
                                autoComplete="off"
                                type="password"
                            />
                            <DefaultButton type="submit">입장</DefaultButton>
                        </Stack>
                    </form>
            </Stack>
        </ModalBase>
    )
}

export default SecretChatModal;