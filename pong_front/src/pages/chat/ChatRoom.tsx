import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../states/contextSocket"
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import { REACT_APP_HOST } from "../../util/configData";
import CustomToastContainer from "../../components/util/CustomToastContainer";
import { toast } from "react-toastify";

function ChatRoom () {
    const setChangeChatPwModalState = useSetRecoilState(changeChatPwModalState);
    const socket = useContext(SocketContext);
    
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const [msg, setMsg] = useState<string>("");
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [master, setMaster] = useState<boolean>(false);   // 현재 유저의 방장 여부
    const roomInfo = useParams() as { id: string };         // undefined 해결용 type assersion
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setMaster(location.state.isMaster);
    }, [location.state.isMaster]);

    useEffect(() => {
        if (current !== '') {
            // NOTE - 재등록 과정 없어짐에 따라 삭제된 코드 (확인 후 삭제하기)
            // /* 방에 재 등록 */
            // socket.on('getUser', (data) => {
            //     console.log("emit getUser: ", current);
            //     socket.emit('getUser', {roomName: roomInfo.id, userId: current});
            //     /* 방장 여부 확인 */
            //     socket.emit('/api/get/master/status');
            //     socket.on('/api/get/master/status', (data: boolean) => {
            //         console.log('isMaster: ', data);
            //         setMaster(data);   // 방장이면 true / 아니면 false
            //     });
            // })

            /* 방장 여부 확인 */
            // socket.emit('/api/get/master/status');
            socket.emit('/api/get/master/status', roomInfo.id); // NOTE - 방 이름까지 함께 보내주기
            socket.on('/api/get/master/status', (data: boolean) => {
                // console.log('isMaster: ', data);
                setMaster(data);   // 방장이면 true / 아니면 false
            });
            /* 추방 여부 듣기 */
            socket.on('youKick', ()=>{
                console.log("kick!!");
                socket.off('youKick');
                toast("🔥 추방당했습니다!");
                navigate('/lobby');
            });
            // TODO - 방장 위임 결과 제대로 반영되는지 확인해 볼 것.
        }

        return () => {
            /* 이벤트 해제 */
            socket.off('getUser');
            socket.off('/api/get/master/status');
            socket.off('youKick');
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
            // socket.emit('chat', roomInfo.id, current, msg);
            // console.log("chat");
            socket.emit('chat', roomInfo.id, msg); // NOTE - userID 빼고 보내주기
            setMsg("");
        }
    }


    return (
        <>
        <ChangeChatPwModal roomName={roomInfo.id}/>
        <CustomToastContainer/>
        <ChatMenuModal isMaster={master} roomName={roomInfo.id}/>
        <Center>
            <div id="chat-room">
                {master ? <button onClick={(e) => {setChangeChatPwModalState({roomName: roomInfo.id, show: true})}} id="change-pw-btn">비밀번호 설정</button> : null}
                <button onClick={exitHandler} id="exit-chat-btn">채팅방 나가기</button>
                <ChatField roomName={roomInfo.id} current={current}/>
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