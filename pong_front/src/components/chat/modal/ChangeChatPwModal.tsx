import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { SocketContext } from '../../../common/states/contextSocket';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { changeChatPwModalState } from "../../../common/states/recoilModalState"
import ModalBase from '../../modal/ModalBase';
import { InputTextWrapper } from '../../../common/styles/InputTextWrapper.style';
import { Stack } from '../../../common/styles/Stack.style';

function ChangeChatPwModal(props: {roomName: string}) {
    const showModal = useRecoilValue(changeChatPwModalState);
    const resetState = useResetRecoilState(changeChatPwModalState);
    const [value, setValue] = useState<string>("");
    const socket = useContext(SocketContext);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        socket.emit('chatPutSetSecretpw', props.roomName, value); // 설정할 비밀번호를 보내기
        toast.success("비밀번호 설정을 완료했습니다!");
        resetState();
    }

    if (showModal.show) {
        return (
            <ModalBase open={showModal.show} reset={resetState}>
                <Stack>
                    <h2>비밀번호 설정</h2>
                    <form onSubmit={handler}>
                        <InputTextWrapper>
                            <span>비밀번호</span>
                            <input type="password" autoComplete="off" placeholder="공란으로 둘 경우 공개방이 됩니다." value={value} onChange={(e) => setValue(e.target.value)} />
                        </InputTextWrapper>
                        <button type="submit">변경</button>
                    </form>
                </Stack>
            </ModalBase>
        );
    }
    return null;
}

export default ChangeChatPwModal;