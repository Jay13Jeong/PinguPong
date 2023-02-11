import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../common/states/contextSocket";
import { useNavigate, useLocation } from "react-router-dom";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST } from "../../common/configData";
import Loader from "../../components/util/Loader";
import DmField from "../../components/chat/DmField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useCheckLogin from "../../util/useCheckLogin";
import ChatMenuModal from "../../components/chat/modal/ChatMenuModal";
import GameInviteModal from "../../components/chat/modal/GameInviteModal";

import { ChatRoomWrapper } from "../../components/chat/ChatRoom.styles";

function DmPage() {
    useCheckLogin();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const [msg, setMsg] = useState<string>("");
    const [invitedInfo, setInvitedInfo] = useState<{id: number, username: string}>({id: -1, username: ""});

    const targetId = location.state.targetId;

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        /* 게임 초대 신청 듣기 */
        socket.on('duelAccept', (targetId: number, targetUsername: string) => {
            setInvitedInfo({id: targetId, username: targetUsername});
        })

        /* 게임 초대 취소 듣기 */
        socket.on('duelTargetRun', (targetUserName: string) => {
            setInvitedInfo({id: -1, username: ""});
        })
    }, []);

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            socket.emit('sendDm', {targetId: targetId, msg: msg});
            setMsg("");
        }
    }

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('closeDm', targetId);
        navigate("/lobby");
    }

    return (
        <>
        <ChatMenuModal isMaster={false} roomName={""}/>
        <GameInviteModal targetID={invitedInfo.id} targetUserName={invitedInfo.username} setInviteInfo={setInvitedInfo}/>
        {current === "" ? <Loader/> :
        <ChatRoomWrapper>
            <button onClick={exitHandler} id="exit-chat-btn">DM 나가기</button>
            <DmField current={current} targetId={targetId}/>
            <form onSubmit={msgHandler} id="chat-input">
                <input type="text" autoComplete="off" id="message" placeholder="메시지를 입력하세요" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
            </form>
        </ChatRoomWrapper>
        }
        </>
    )
}

export default DmPage;