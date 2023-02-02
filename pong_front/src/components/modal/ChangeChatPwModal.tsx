import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../states/contextSocket';
import { useRecoilState } from 'recoil';
import { changeChatPwModalState } from "../../states/recoilModalState"
import { Button } from '../../styles/Inputs';
import ModalBase from './ModalBase';
import { Stack } from '../../styles/Layout';
import './Chat.scss';

function ChangeChatPwModal() {
    const [showModal, setShowModal] = useRecoilState(changeChatPwModalState);
    const [values, setValues] = useState<string>("");
    const socket = useContext(SocketContext);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (values !== "") {
            // 변경 로직
            toast.success("뭔가 입력됨!");
        }
        else {
            toast.error("비밀번호를 입력하세요.");
        }
        // socket.emit('/api/put/setSecretpw', {});
        // socket.on('/api/post/secretPW', (data) => {
        //     if (data) {
        //         socket.off('/api/put/setSecretpw');
        //     }
        //     else {
        //         // toast.error("비밀번호가 틀렸습니다.");
        //         socket.off('/api/put/setSecretpw');
        //     };
        // })
    }

    if (showModal.show) {
        return (
            <ModalBase setter={setShowModal}>
                <Stack className="chat-form-wrapper">
                    <div className="title">비밀번호 변경</div>
                    <form onSubmit={handler}>
                        <div className="wrapper">
                            <span>비밀번호</span>
                            <input type="password" autoComplete="off" placeholder="비밀번호" value={values} onChange={(e) => setValues(e.target.value)} />
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