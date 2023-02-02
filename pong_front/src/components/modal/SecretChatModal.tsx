import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SocketContext } from '../../states/contextSocket';
import useUser from '../../util/useUser';
import { useRecoilState } from 'recoil';
import { secretChatModalState } from '../../states/recoilModalState';
import { Button } from '../../styles/Inputs';
import ModalBase from './ModalBase';
import { Stack } from '../../styles/Layout';
import './Chat.scss';

function SecretChatModal() {
    const [showModal, setShowModal] = useRecoilState(secretChatModalState);
    const [values, setValues] = useState<string>("");
    const myInfo = useUser();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // TODO - 비밀번호 보냄
        // TODO - 입장 성공시
        /**
         * setShowModal(false);
         * navigate(`/chat/room/${values.room}`); // 이런 식으로 보내버리기
         */
        // TODO - 입장 실패시
        /**
         * toast.error("비밀번호가 틀렸습니다.");
         * setValues("");
        */
    }

    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <Stack className="chat-form-wrapper">
                    <div className="title">비밀 채팅방 입장</div>
                    <form onSubmit={handler}>
                        <div className="wrapper">
                            <span>비밀번호</span>
                            <input type="password" placeholder="비밀번호" value={values} onChange={(e) => setValues(e.target.value)} />
                        </div>
                        <Button type="submit">입장</Button>
                    </form>
                </Stack>
            </ModalBase>
        );
    }
    return null;
}

export default SecretChatModal;