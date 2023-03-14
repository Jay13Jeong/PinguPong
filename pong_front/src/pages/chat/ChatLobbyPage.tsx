import {useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState} from "../../common/states/recoilModalState";
import {Stack} from "../../common/styles/Stack.style";
import ChatCardButtonList from "../../components/card/chat/ChatCardButtonList";
import CreateChatModal from "../../components/chat/modal/CreateChatModal";
import useGetData from "../../util/useGetData";
import Loader from "../../components/util/Loader";
import { REACT_APP_HOST } from "../../common/configData";
import useCheckLogin from "../../util/useCheckLogin";
import {ContentBox} from "../../common/styles/ContentBox.style";

function ChatLobbyPage() {
    useCheckLogin();
    const setCreateChatModal = useSetRecoilState(createChatModalState);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState("");
    const [myInfo, infoError, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [chatList, chatListError, isloading] = useGetData(`http://` + REACT_APP_HOST + `/api/chat/rooms`);

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

    return (
    <>
        <CreateChatModal current={current} />
        <ContentBox>
        {loading ? <Loader/> : 
            <Stack>
                <h1>🗣 Chat Room List 🗣</h1>
                <ChatCardButtonList current={current} chatList={chatList}/>
                <button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</button>
            </Stack>
        }
        </ContentBox>
    </>
    );
}

export default ChatLobbyPage;