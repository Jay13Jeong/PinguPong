import React, {useState, useContext, useEffect} from "react";
import { Socket } from "socket.io-client";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { chatMenuModalState } from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import useGetData from "../../util/useGetData";
import ModalBase from "./ModalBase";
import Loader from "../util/Loader";

function ChatMenuModal (props: {isMaster: boolean}) {
    const socket = useContext(SocketContext);
    const modalState = useRecoilValue(chatMenuModalState);
    const resetState = useResetRecoilState(chatMenuModalState);
    const [info, error, isLoading] = useGetData(`http://localhost:3000/api/user/name?username=${modalState.user}`);
    const [menuLoading, isMenuLoading] = useState<boolean>(true);
    const [userID, setUserId] = useState<number>();

    useEffect(() => {
        if (info !== null) {
            setUserId(info.id);
            isMenuLoading(false);
        }
    }, [info, error, isLoading]);

    if (modalState.show) {
        return (
            <ModalBase reset={resetState}>
                <h2>Chat Menu</h2>
                {menuLoading ? <Loader/> : 
                    <>
                    {props.isMaster ? <div>
                        <button>kick</button>
                        <button>ban</button>
                        <button>mute</button>
                        <button>방장 위임</button>
                    </div> : null}
                    <div>
                        <button>도전장 보내기</button>
                        <button>프로필 보기</button>
                    </div>
                    </>
                }
            </ModalBase>
        )
    }
    return null;
}

export default ChatMenuModal;