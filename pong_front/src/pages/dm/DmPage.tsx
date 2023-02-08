import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../states/contextSocket";
import { useNavigate, useLocation } from "react-router-dom";
import { Center } from "../../styles/Layout";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST } from "../../util/configData";
import "../../components/chat/ChatRoom.scss"
import Loader from "../../components/util/Loader";
import DmField from "../../components/chat/DmField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function DmPage() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const [msg, setMsg] = useState<string>("");

    const targetId = location.state.targetId;

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            // socket.emit('sendDm', targetId, current, msg);
            // console.log("sendDM : ", targetId, msg);
            socket.emit('sendDm', {targetId: targetId, msg: msg});
            setMsg("");
        }
    }

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('closeDm', targetId);
        navigate("/lobby");
    }

    return (
        <Center>
            {current === "" ? <Loader/> :
            <div id="chat-room">
                <button onClick={exitHandler} id="exit-chat-btn">DM 나가기</button>
                <DmField current={current} targetId={targetId}/>
                <form onSubmit={msgHandler} id="chat-input">
                    <input type="text" autoComplete="off" id="message" placeholder="메시지를 입력하세요" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                </form>
            </div>
            }
        </Center>
    )
}

export default DmPage;