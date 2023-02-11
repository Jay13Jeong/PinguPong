import {useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from "recoil";
import {createChatModalState} from "../../common/states/recoilModalState";
import {Stack} from "../../common/styles/Stack.style";
// import {Button} from "../../styles/Inputs";
import ChatCardButtonList from "../../components/chat/card/ChatCardButtonList";
// import CustomToastContainer from "../../components/util/CustomToastContainer";
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
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');

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
    <>
        {/* <CustomToastContainer/> */}
        <CreateChatModal current={current}/>
        <ContentBox>
        {loading ? <Loader/> : 
            <Stack>
                <h1>🗣 Chat Room List 🗣</h1>
                <ChatCardButtonList current={current}/>
                <button onClick={(e) => {setCreateChatModal(true)}}>새 채팅방 생성</button>
            </Stack>
        }
        </ContentBox>
    </>
    );
}

export default ChatLobbyPage;