import React, {useState, useContext, useEffect} from "react";
import { Socket } from "socket.io-client";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { chatMenuModalState } from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import useGetData from "../../util/useGetData";
import ModalBase from "./ModalBase";
import Loader from "../util/Loader";
import { REACT_APP_HOST } from "../../util/configData";

function ChatMenuModal (props: {roomName: string, isMaster: boolean}) {
    const socket = useContext(SocketContext);
    const modalState = useRecoilValue(chatMenuModalState);
    const resetState = useResetRecoilState(chatMenuModalState);
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
        // TODO - 음소거 여부 알아야 함!!!!!
        return(() => {
            // 이벤트 리스너 제거하기.
        })
    }, [socket]);

    useEffect(() => {
        if (targetID !== undefined && isMuted !== undefined)
            isMenuLoading(false);
    }, [targetID, isMuted])

    /* 추방 (현재 채팅방을 강제로 나가게 함) */
    function kickHandler(e: React.MouseEvent<HTMLElement>) {
        // 추방  기능
    }

    /* 채팅방에 못들어오게 함 */
    function banHandler(e: React.MouseEvent<HTMLElement>) {
        // 밴 기능
    }

    /* 음소거 (target 유저가 말하는 것은 누구에게도 표시되지 않는다.) */
    function muteHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/put/addmuteuser', props.roomName, modalState.user);
    }

    function freemuteHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/put/freemuteuser', props.roomName, modalState.user);
    }

    function setMasterHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('/api/post/mandateMaster', props.roomName, modalState.user);
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
    }

    if (modalState.show) {
        return (
            <ModalBase reset={resetState}>
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
                        <button onClick={(e) => {}}>프로필 보기</button>
                    </div>
                    </>
                }
            </ModalBase>
        )
    }
    return null;
}

export default ChatMenuModal;