import React, {useContext} from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState, secretChatModalState} from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import {Center, Stack} from "../../styles/Layout";
import {Button} from "../../styles/Inputs";
import ChatCardButtonList from "../../components/util/card/ChatCardButtonList";

function ChatLobby() {
    /* socket */
    const socket = useContext(SocketContext);

    /* state */
    const setCreateChatModal = useSetRecoilState(createChatModalState);
    const setSecretChatModalState = useSetRecoilState(secretChatModalState);

    return (
    <Center>
        <ToastContainer
            position="top-right"
            autoClose={500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable={false}
            theme="dark"
            />
        <Stack>
            <h1>채팅방 리스트</h1>
            <ChatCardButtonList/>
            <Button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</Button>
            <Button onClick={(e) => {setSecretChatModalState(true)}}>비밀방 모달 테스트</Button>
        </Stack>
    </Center>
    );
}

export default ChatLobby;