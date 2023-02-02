import React, {useContext} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState, secretChatModalState} from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import {Center, Stack} from "../../styles/Layout";
import {Button} from "../../styles/Inputs";
import ChatCardButtonList from "../../components/util/card/ChatCardButtonList";
import CustomToastContainer from "../../components/util/CustomToastContainer";


function ChatLobby() {
    /* socket */
    const socket = useContext(SocketContext);

    /* state */
    const setCreateChatModal = useSetRecoilState(createChatModalState);

    return (
    <Center>
        <CustomToastContainer/>
        <Stack>
            <h1>채팅방 리스트</h1>
            <ChatCardButtonList/>
            <Button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</Button>
        </Stack>
    </Center>
    );
}

export default ChatLobby;