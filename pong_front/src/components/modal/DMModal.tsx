import React, {useEffect, useState, useContext} from "react";
import { SocketContext } from "../../states/contextSocket";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { dmModalState } from "../../states/recoilModalState";
import DmCardButtonList from "../util/card/DmCardButtonList";
import Loader from "../util/Loader";
import ModalBase from "./ModalBase";

function DMModal() {
    // const [showModal, setShowModal] = useRecoilState(dmModalState);
    const showModal = useRecoilValue(dmModalState);
    const resetState = useResetRecoilState(dmModalState);
    const socket = useContext(SocketContext);
    const [dmList, setDmList] = useState<string[]>();
    useEffect(() => {
        if (showModal) {
            socket.emit('dmList')
            socket.on('dmList', (data) => {
                // console.log("dmList : ", data);
                setDmList([...data]);
            })
        }
        return (() => {
            socket.off('dmList');
        })
    }, [socket, showModal]);

    if (showModal) {
        return (
            <ModalBase reset={resetState}>
                {dmList === undefined ? <Loader/> : 
                <DmCardButtonList dmList={dmList}/>}
            </ModalBase>
        )
    }
    return null;
}

export default DMModal;