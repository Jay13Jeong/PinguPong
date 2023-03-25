import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { SocketContext } from '../../../common/states/contextSocket';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { changeChatPwModalState } from "../../../common/states/recoilModalState"
import ModalBase from '../../modal/ModalBase';
import { Stack, Typography, TextField } from '@mui/material';
import { DefaultButton } from '../../common';

function ChangeChatPwModal(props: {roomName: string}) {
    const showModal = useRecoilValue(changeChatPwModalState);
    const resetState = useResetRecoilState(changeChatPwModalState);
    const [value, setValue] = useState<string>("");
    const socket = useContext(SocketContext);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        socket.emit('chatPutSetSecretpw', props.roomName, value); // 설정할 비밀번호를 보내기
        toast.success("비밀번호 설정을 완료했습니다!");
        setValue('');
        resetState();
    }

    return (
        <ModalBase open={showModal.show} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h3" gutterBottom sx={{marginLeft: "3rem", marginRight: "3rem"}}>비밀번호 설정</Typography>
                <form style={{width: "100%"}} onSubmit={handler}>
                        <Stack spacing={1} >
                            <TextField fullWidth size="small"
                                label="비밀번호"
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                variant="standard"
                                autoComplete="off"
                                helperText="공란으로 둘 경우 공개방이 됩니다."
                            />
                            <DefaultButton type="submit">변경</DefaultButton>
                        </Stack>
                    </form>
            </Stack>
        </ModalBase>
    )
}

export default ChangeChatPwModal;