import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../common/states/contextSocket"
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import { changeChatPwModalState, gameInviteModalState } from "../../common/states/recoilModalState"
import ChangeChatPwModal from "../../components/chat/modal/ChangeChatPwModal";
import ChatField from "../../components/chat/ChatField";
import useGetData from "../../util/useGetData";
import ChatMenuModal from "../../components/chat/modal/ChatMenuModal";
import { REACT_APP_HOST } from "../../common/configData";
import { toast } from "react-toastify";
import useCheckLogin from "../../util/useCheckLogin";
import GameInviteModal from "../../components/chat/modal/GameInviteModal";

import { ChatRoomWrapper } from "../../components/chat/ChatRoom.styles";

function ChatRoomPage () {
    useCheckLogin();
    const setChangeChatPwModalState = useSetRecoilState(changeChatPwModalState);
    const setGameInviteModal = useSetRecoilState(gameInviteModalState);
    const socket = useContext(SocketContext);
    
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const [msg, setMsg] = useState<string>("");
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [master, setMaster] = useState<boolean>(false);   // 현재 유저의 방장 여부
    const roomInfo = useParams() as { id: string };         // undefined 해결용 type assersion
    const [invitedInfo, setInvitedInfo] = useState<{id: number, username: string}>({id: -1, username: ""});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setMaster(location.state.isMaster);
    }, [location.state.isMaster]);

    useEffect(() => {
        if (current !== '') {
            /* 방장 여부 확인 */
            socket.emit('/api/get/master/status', roomInfo.id);
            socket.on('/api/get/master/status', (data: boolean) => {
                setMaster(data);   // 방장이면 true / 아니면 false
            });
            /* 추방 여부 듣기 */
            socket.on('youKick', ()=>{
                socket.off('youKick');
                toast("🔥 추방당했습니다!");
                navigate('/lobby');
            });
            /* 방장 여부 듣기 */
            socket.on('youMaster', ()=> {
                console.log("youMaster!!");
                setMaster(true);
            })

            /* 게임 초대 신청 듣기 */
            socket.on('duelAccept', (targetId: number, targetUsername: string) => {
                setInvitedInfo({id: targetId, username: targetUsername});
            })

            /* 게임 초대 취소 듣기 */
            socket.on('duelTargetRun', (targetUserName: string) => {
                setInvitedInfo({id: -1, username: ""});
            })
        }

        return () => {
            /* 이벤트 해제 */
            socket.off('getUser');
            socket.off('/api/get/master/status');
            socket.off('youKick');
            socket.off('duelAccept');
        };
    }, [socket, current, roomInfo.id, navigate]);

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        // data : string (roomName);
        socket.emit('delUser', roomInfo.id);
        navigate("/lobby");
    }

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            socket.emit('chat', roomInfo.id, msg); // NOTE - userID 빼고 보내주기
            setMsg("");
        }
    }


    return (
        <>
        <ChangeChatPwModal roomName={roomInfo.id}/>
        {/* <CustomToastContainer/> */}
        <ChatMenuModal isMaster={master} roomName={roomInfo.id} setMaster={setMaster}/>
        <GameInviteModal targetID={invitedInfo.id} targetUserName={invitedInfo.username} setInviteInfo={setInvitedInfo}/>
        <ChatRoomWrapper>
            {invitedInfo.id !== -1 ? <button onClick={(e) => {setGameInviteModal(true)}} id="duel-request-btn">도전장 도착</button> : null}
            {master ? <button onClick={(e) => {setChangeChatPwModalState({roomName: roomInfo.id, show: true})}} id="change-pw-btn">비밀번호 설정</button> : null}
            <button onClick={exitHandler} id="exit-chat-btn">채팅방 나가기</button>
            <ChatField roomName={roomInfo.id} current={current}/>
            <form onSubmit={msgHandler} id="chat-input">
                <input type="text" autoComplete="off" id="message" placeholder="메시지를 입력하세요" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
            </form>
        </ChatRoomWrapper>
        </>
    )
}

export default ChatRoomPage;