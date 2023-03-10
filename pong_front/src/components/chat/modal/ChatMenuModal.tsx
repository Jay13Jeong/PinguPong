import React, {useState, useContext, useEffect} from "react";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { chatMenuModalState, profileModalState } from "../../../common/states/recoilModalState";
import { SocketContext } from "../../../common/states/contextSocket";
import useGetData from "../../../util/useGetData";
import ModalBase from "../../modal/ModalBase";
import Loader from "../../util/Loader";
import { REACT_APP_HOST } from "../../../common/configData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Friend, User } from "../../../common/types/User";
import axios from "axios";
// import { userState } from "../../states/recoilUserState";

function ChatMenuModal (props: {roomName: string, isMaster: boolean, setMaster?: Function, isDmModal: boolean}) {
    const socket = useContext(SocketContext);
    const modalState = useRecoilValue(chatMenuModalState);
    const resetState = useResetRecoilState(chatMenuModalState);
    const profileState = useSetRecoilState(profileModalState);
    const [info, error, loading] = useGetData(`http://` + REACT_APP_HOST + `/api/user/name?username=${modalState.user}`, modalState.user);
    const [current, setCurrent] = useState("");
    const [myInfo, myerror, myLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [menuLoading, isMenuLoading] = useState<boolean>(true);
    const [targetID, setTargetID] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && info !== null) {
            setTargetID(info.id);
        }
    }, [info, error, loading]);

    useEffect(() => {
        if (!myLoading && myInfo !== null) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, myerror, myLoading]);

    useEffect(() => {
        // let [roomName, targetId] = data;//음소거 체크할 유저id
        if (props.isDmModal !== true) {
            socket.emit('chatGetMuteUser', props.roomName, targetID);
            socket.on('chatGetMuteUser', (data: boolean) => {
                setIsMuted(data);
            })
        }
    }, [socket, modalState.user, props.isDmModal]);

    useEffect(() => {
        if (props.isDmModal !== true) {
            if (targetID !== undefined && isMuted !== undefined && current !== "") {
                isMenuLoading(false);
            }
        }
        else {
            if (targetID !== undefined && current !== "") {
                isMenuLoading(false);
            }
        }
    }, [targetID, isMuted]);

    useEffect(() => {
        return(() => {
            socket.off('chatGetMuteUser');
            socket.off('duelRequest');
        })
    }, [socket]);

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
        socket.emit('chatPutAddmuteuser', props.roomName, targetID);
        toast("🔇 mute completed!");
        resetState();
    }

    function freemuteHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('chatPutFreeMuteUser', props.roomName, targetID);
        toast("🔈 unmute completed!");
        resetState();
    }

    function setMasterHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('chatPostMandateMaster', props.roomName, targetID);
        toast("👑 master set up completed!");
        props.setMaster && props.setMaster(false);
        resetState();
    }

    function inviteHandler(e: React.MouseEvent<HTMLElement>) {
        /**
         * NOTE - 흐름
         * - 도전장을 보냄
         * - 모달 리셋
         * - 소켓 이벤트 off
         * - 게임 화면으로 전환 (로딩)
         */
        /**
         * 'duelRequest'
         * let targetId:number = data.targetId;
         * return boolean (성공시 true, 여러 이유로 실패하면 false)
         */
        socket.emit('duelRequest', {targetId: targetID, roomName: props.roomName});
        /* 성공 여부 듣기 */
        socket.on('duelRequest', (data: boolean) => {
            if (data === true) {
                socket.off('duelRequest');
                // 성공
                resetState();
                // 도전 신청한 쪽이 p1이 됩니다.
                navigate(`/game/match/${current}vs${modalState.user}`, {state: {
                    player1: current,
                    player2: modalState.user,
                    current: current,
                    invite: true,
                    targetId: targetID
                }});
            }
            else {
                socket.off('duelRequest');
                toast.error("📤 dual request failed!");
                resetState();
            }
        });
        resetState();
    }

    function showProfileHander(e: React.MouseEvent<HTMLElement>) {
        if (targetID) {
            profileState({userId: targetID, show: true})
        }
        resetState();
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
                        {targetID !== 0 ?
                        <button onClick={showProfileHander}>프로필 보기</button>
                        : null}
                    </div>
                    </>
                }
            </ModalBase>
        )
    }
    return null;
}

export default ChatMenuModal;