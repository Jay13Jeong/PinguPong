import React, {useContext} from "react";
import { useSetRecoilState } from "recoil";
import {createChatModalState} from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import {Center, Stack} from "../../styles/Layout";
import {Button} from "../../styles/Inputs";
import ChatCardButtonList from "../../components/util/card/ChatCardButtonList";

function ChatLobby() {
    /* socket */
    const socket = useContext(SocketContext);

    /* state */
    const setCreateChatModal = useSetRecoilState(createChatModalState);

    return (
    <Center>
        <Stack>
            <Button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</Button>
            <ChatCardButtonList/>
        </Stack>
    </Center>
    );
}

export default ChatLobby;