import React, {useState, useContext, useEffect} from "react";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { chatMenuModalState, profileModalState } from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import useGetData from "../../util/useGetData";
import ModalBase from "./ModalBase";
import Loader from "../util/Loader";
import { REACT_APP_HOST } from "../../util/configData";
import { toast } from "react-toastify";

function ChatMenuModal (props: {roomName: string, isMaster: boolean, setMaster: Function}) {
    const socket = useContext(SocketContext);
    const modalState = useRecoilValue(chatMenuModalState);
    const resetState = useResetRecoilState(chatMenuModalState);
    const profileState = useSetRecoilState(profileModalState);
    const [info, error, isLoading] = useGetData(`http://` + REACT_APP_HOST + `:3000/api/user/name?username=${modalState.user}`);
    const [menuLoading, isMenuLoading] = useState<boolean>(true);
    const [targetID, setTargetID] = useState<number>();
    const [isMuted, setIsMuted] = useState<boolean>(); // TODO - 이 유저가 음소거인지 아닌지 확인해야 함.

    useEffect(() => {
        if (!isLoading && info !== null) {
            setTargetID(info.id);
        }
    }, [info, error, isLoading]);

    useEffect(() => {
        // let [roomName, targetId] = data;//음소거 체크할 유저id
        socket.emit('api/get/muteuser', props.roomName, targetID);
        socket.on('api/get/muteuser', (data: boolean) => {
            setIsMuted(data);
        })
        return(() => {
            socket.off('api/get/muteuser');
        })
    }, [socket, modalState.user]);

    useEffect(() => {
        if (targetID !== undefined && isMuted !== undefined) {
            isMenuLoading(false);
        }
    }, [targetID, isMuted]);

    /* 추방 (현재 채팅방을 강제로 나가게 함) */
    function kickHandler(e: React.MouseEvent<HTMLElement>) {
        // 추방 기능
        // let [roomName, targetId] = data;
        socket.emit('kickUser', props.roomName, targetID);
        toast("👟 kick completed!");
        resetState();
    }

    /* 채팅방에 못들어오게 함 */
    function banHandler(e: React.MouseEvent<HTMLElement>) {
        // 밴 기능
        // let [roomName, targetId] = data;
        socket.emit('banUser', props.roomName, targetID);
        toast("🔥 ban completed!");
        resetState();
    }

    /* 음소거 (target 유저가 말하는 것은 누구에게도 표시되지 않는다.) */
    function muteHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/put/addmuteuser', props.roomName, targetID);
        toast("🔇 mute completed!");
        resetState();
    }

    function freemuteHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/put/freemuteuser', props.roomName, targetID);
        toast("🔈 unmute completed!");
        resetState();
    }

    function setMasterHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/post/mandateMaster', props.roomName, targetID);
        toast("👑 master set up completed!");
        props.setMaster(false);
        resetState();
    }

    function inviteHandler(e: React.MouseEvent<HTMLElement>) {
        // TODO - 도전장 기능
        /**
         * NOTE - 흐름
         * - 도전장을 보냄
         * - 모달 리셋
         * - 소켓 이벤트 off
         * - 게임 화면으로 전환 (로딩)
         */
        // TODO - 처리 후 toast, 모달 닫기
    }

    if (modalState.show) {
        return (
            <ModalBase reset={resetState} z_index={100}>
                <h2>Chat Menu</h2>
                {menuLoading ? <Loader/> : 
                    <>
                    {props.isMaster ? <div>
                        <button onClick={kickHandler}>강퇴</button>
                        <button onClick={banHandler}>추방</button>
                        {isMuted ? <button onClick={freemuteHandler}>음소거 해제</button> : <button onClick={muteHandler}>음소거</button>}
                        <button onClick={setMasterHandler}>방장 위임</button>
                    </div> : null}
                    <div>
                        <button onClick={inviteHandler}>도전장 보내기</button>
                        <button onClick={(e) => {targetID && profileState({userId: targetID, show: true})}}>프로필 보기</button>
                    </div>
                    </>
                }
            </ModalBase>
        )
    }
    return null;
}

export default ChatMenuModal;