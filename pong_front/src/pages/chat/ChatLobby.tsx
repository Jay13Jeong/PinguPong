import React, {useEffect, useState, useContext} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState, secretChatModalState} from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import {Center, Stack} from "../../styles/Layout";
import {Button} from "../../styles/Inputs";
import ChatCardButtonList from "../../components/util/card/ChatCardButtonList";
import CustomToastContainer from "../../components/util/CustomToastContainer";
import CreateChatModal from "../../components/modal/CreateChatModal";
import useGetData from "../../util/useGetData";
import Loader from "../../components/util/Loader";

function ChatLobby() {
    /* socket */
    const socket = useContext(SocketContext);
    /* modal state */
    const setCreateChatModal = useSetRecoilState(createChatModalState);
    /* info */
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState("");
    const [myInfo, error, isLoading] = useGetData('http://localhost:3000/api/user');

    useEffect(() => {
        if (myInfo) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        if (current !== "") {
            setLoading(false);
        }
        else
            setLoading(true);
    }, [current]);

    return (
    <Center>
        <CustomToastContainer/>
        <CreateChatModal current={current}/>
        {loading ? <Loader/> : 
            <Stack>
                <h1>채팅방 리스트</h1>
                <ChatCardButtonList current={current}/>
                <Button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</Button>
            </Stack>
        }
    </Center>
    );
}

export default ChatLobby;