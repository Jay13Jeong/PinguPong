import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../states/contextSocket"
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Center } from "../../styles/Layout";
import { useSetRecoilState } from "recoil";
import { changeChatPwModalState } from "../../states/recoilModalState"
import CustomToastContainer from "../../components/util/CustomToastContainer";
import ChangeChatPwModal from "../../components/modal/ChangeChatPwModal";
import ChatField from "../../components/chat/ChatField";
import axios from "axios";
import "../../components/chat/ChatRoom.scss"

function ChatRoom () {
    const setChangeChatPwModalState = useSetRecoilState(changeChatPwModalState);
    const socket = useContext(SocketContext);
    const location = useLocation();
    
    const [msg, setMsg] = useState<string>("");
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [master, setMaster] = useState<boolean>(true);    // 현재 유저의 방장 여부
    const isSecret = location.state.isSecret;               // 현재 방의 비밀방 여부
    const roomName = location.state.roomName;               // 현재 방의 이름

    const navigate = useNavigate();

    function fightHandler (e: React.MouseEvent<HTMLElement>) {
        // TODO - 도전장 기능
        alert("무슨 일을 하는 버튼인가요?");
    }

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('delUser');
        navigate("/lobby");
    }

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (msg !== "") {
            socket.emit('chat', roomName, current, msg);
            setMsg("");
        }
    }

    useEffect(() => {
        // TODO - 현재 유저의 ID 알아오기
        axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            // console.log(res.data);
            if (res.data){
                setCurrent(res.data.username as string);
            }
        })
        .catch(err => {
            if (err.response.data.statusCode === 401)
            navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
        // TODO - 방장 여부 확인해야 함.
        socket.on('getUser', (data) => {
            socket.emit('getUser', {roomName: roomName, userId: current});
        })
        socket.emit('/api/get/master/status');
        socket.on('/api/get/master/status', (data: boolean) => {
            setMaster(data);   // 방장이면 true / 아니면 false
        });

        return () => {
            // 이벤트 해제
            socket.off('/api/get/master/status');
            socket.off('getUser');
        };
    }, [navigate, socket]);

    /**
     * NOTE 
     * - socket.on은 chat-field에서 해 주기
     * - getUser의 시점?
     * - chat-field 에서 채팅 목록을 관리하고 있어야 함. (ㅎㅅㅎ)
     */

    return (
        <>
        <ChangeChatPwModal/>
        {/* TODO 채팅용 유저 프로필 모달 - 방장기능 / 방장 아닌 경우에 대해서 고민해보기 */}
        <CustomToastContainer/>
        <Center>
            <div id="chat-room">
                {isSecret && master ? <button onClick={(e) => {setChangeChatPwModalState({roomName: roomName, show: true})}} id="change-pw-btn">비밀번호 변경</button> : null}
                <button onClick={fightHandler} id="fight-btn">도전장 도착</button>
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