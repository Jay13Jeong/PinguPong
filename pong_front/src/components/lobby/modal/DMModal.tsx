import {useEffect, useState, useContext} from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { dmModalState } from "../../../common/states/recoilModalState";
import DmCardButtonList from "../../card/dm/DmCardButtonList";
import Loader from "../../util/Loader";
import ModalBase from "../../modal/ModalBase";

function DMModal() {
    const showModal = useRecoilValue(dmModalState);
    const resetState = useResetRecoilState(dmModalState);
    const socket = useContext(SocketContext);
    const [dmList, setDmList] = useState<string[]>();
    useEffect(() => {
        if (showModal) {
            socket.emit('dmList')
            socket.on('dmList', (data) => {
                setDmList([...data]);
            })
        }
        return (() => {
            socket.off('dmList');
        })
    }, [socket, showModal]);

    if (showModal) {
        console.log("showModal");
        return (
            <ModalBase reset={resetState}>
                <h1>💌 DM List 💌</h1>
                {dmList === undefined ? <Loader/> : 
                <DmCardButtonList dmList={dmList}/>}
            </ModalBase>
        )
    }
    return null;
}

export default DMModal;