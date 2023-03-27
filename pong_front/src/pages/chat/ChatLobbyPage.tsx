import {useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState} from "../../common/states/recoilModalState";
import CreateChatModal from "../../components/chat/modal/CreateChatModal";
import SecretChatModal from "../../components/chat/modal/SecretChatModal";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST } from "../../common/configData";
import useCheckLogin from "../../util/useCheckLogin";

import CardList from "../../components/card/CardList";
import ChatCardButton from "../../components/card/chat/ChatCardButton";
import { Stack, Typography } from "@mui/material"
import { DefaultBox, DefaultButton, DefaultLinearProgress } from "../../components/common";

function ChatLobbyPage() {
    useCheckLogin();
    const setCreateChatModal = useSetRecoilState(createChatModalState);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState("");
    const [myInfo, infoError, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [chatList, chatListError, isloading] = useGetData(`http://` + REACT_APP_HOST + `/api/chat/rooms`);
    const [currPage, setCurrPage] = useState<number>(1);

    useEffect(() => {
        if (myInfo) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, infoError, isLoading]);

    useEffect(() => {
        if (current !== "" && chatList) {
            setLoading(false);
        }
        else
            setLoading(true);
    }, [current, chatList]);

    const cardsPerPage = 3;
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = chatList ? Math.ceil(chatList.length / cardsPerPage) : 0;

    return (
    <>
        <CreateChatModal current={current} />
        <SecretChatModal current={current} />
        <DefaultBox>
            <Stack
                justifyContent="center"
                alignItems="center"
            >
                {loading && chatList ? 
                <>
                    <Typography variant="subtitle1" gutterBottom>목록 로딩중...</Typography>
                    <DefaultLinearProgress />
                </> : 
                <>
                    <Typography variant="h2" gutterBottom>🗣 Chat Room List 🗣</Typography>
                    <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
                        {
                            chatList ? 
                            chatList.slice(offset, offset + cardsPerPage).map((item: string, index: number) => 
                                <ChatCardButton key={index} roomName={item} current={current}/>
                            ) 
                            : <></>
                        }
                        
                    </CardList>
                    <DefaultButton onClick={() => setCreateChatModal(true)}>새 채팅방 생성</DefaultButton>
                </>
                }
            </Stack>
        </DefaultBox>
    </>
    );
}

export default ChatLobbyPage;