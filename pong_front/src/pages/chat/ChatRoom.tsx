import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../states/contextSocket"
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Center } from "../../styles/Layout";
import { useSetRecoilState } from "recoil";
import { changeChatPwModalState } from "../../states/recoilModalState"
import ChangeChatPwModal from "../../components/modal/ChangeChatPwModal";
import ChatField from "../../components/chat/ChatField";
// import axios from "axios";
import useGetData from "../../util/useGetData";
import ChatMenuModal from "../../components/modal/ChatMenuModal";
import "../../components/chat/ChatRoom.scss"

function ChatRoom () {
    const setChangeChatPwModalState = useSetRecoilState(changeChatPwModalState);
    const socket = useContext(SocketContext);
    const location = useLocation();
    
    const [myInfo, error, isLoading] = useGetData('http://localhost:3000/api/user');
    const [msg, setMsg] = useState<string>("");
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [master, setMaster] = useState<boolean>(false);    // 현재 유저의 방장 여부
    const isSecret = location.state.isSecret;               // 현재 방의 비밀방 여부
    const roomName = location.state.roomName;               // 현재 방의 이름

    const navigate = useNavigate();

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('delUser');
        navigate("/lobby");
    }

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            socket.emit('chat', roomName, current, msg);
            setMsg("");
        }
    }

    useEffect(() => {
        /* 방에 재 등록 */
        if (current !== '') {
            socket.on('getUser', (data) => {
                socket.emit('getUser', {roomName: roomName, userId: current});
                    /* 방장 여부 확인 */
                socket.emit('/api/get/master/status');
                socket.on('/api/get/master/status', (data: boolean) => {
                    setMaster(data);   // 방장이면 true / 아니면 false
                });
            })
            // TODO - 본인이 추방당했는지 듣고 있어야 함.
        }

        return () => {
            /* 이벤트 해제 */
            socket.off('getUser');
            socket.off('/api/get/master/status');
        };
    }, [socket, current, roomName]);

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    return (
        <>
        <ChangeChatPwModal/>
        <ChatMenuModal isMaster={master} roomName={roomName}/>
        <Center>
            <div id="chat-room">
                {isSecret && master ? <button onClick={(e) => {setChangeChatPwModalState({roomName: roomName, show: true})}} id="change-pw-btn">비밀번호 변경</button> : null}
                {/* <button onClick={fightHandler} id="fight-btn">도전장 도착</button> */}
                {master ? <div id="fight-btn">👑 나는 방장 👑</div> : null}
                <button onClick={exitHandler} id="exit-chat-btn">채팅방 나가기</button>
                <ChatField roomName={roomName} current={current}/>
                <form onSubmit={msgHandler} id="chat-input">
                    <input type="text" autoComplete="off" id="message" placeholder="메시지를 입력하세요" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                </form>
            </div>
        </Center>
        </>
    )
}

export default ChatRoom;