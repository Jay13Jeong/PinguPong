import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../states/contextSocket';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { changeChatPwModalState } from "../../states/recoilModalState"
import { Button } from '../../styles/Inputs';
import ModalBase from './ModalBase';
import { Stack } from '../../styles/Layout';
import './Chat.scss';

function ChangeChatPwModal() {
    const showModal = useRecoilValue(changeChatPwModalState);
    const resetState = useResetRecoilState(changeChatPwModalState);
    const [value, setValue] = useState<string>("");
    const socket = useContext(SocketContext);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        socket.emit('/api/put/setSecretpw', value); // 설정할 비밀번호를 보내기
        toast.success("비밀번호 설정을 완료했습니다!");
        resetState();
    }

    if (showModal.show) {
        return (
            <ModalBase reset={resetState}>
                <Stack className="chat-form-wrapper">
                    <div className="title">비밀번호 설정</div>
                    <form onSubmit={handler}>
                        <div className="wrapper">
                            <span>비밀번호</span>
                            <input type="password" autoComplete="off" placeholder="공란으로 둘 경우 공개방이 됩니다." value={value} onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <Button type="submit">변경</Button>
                    </form>
                </Stack>
            </ModalBase>
        );
    }
    return null;
}

export default ChangeChatPwModal;