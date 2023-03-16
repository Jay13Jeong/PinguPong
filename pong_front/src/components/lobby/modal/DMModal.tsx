import {useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { dmModalState } from "../../../common/states/recoilModalState";
import DmCardButtonList from "../../card/dm/DmCardButtonList";
import Loader from "../../util/Loader";
import ModalBase from "../../modal/ModalBase";
import { REACT_APP_HOST } from "../../../common/configData";
import axios from "axios";


function DMModal() {
    const showModal = useRecoilValue(dmModalState);
    const resetState = useResetRecoilState(dmModalState);
    const [dmList, setDmList] = useState<string[]>();
    useEffect(() => {
        const getDmList = async () => {
            try {
                await axios.get(`http://` + REACT_APP_HOST + `/api/chatdm/rooms`, {withCredentials: true})
                .then((res) => {
                    setDmList([...res.data]);
                })
            }
            catch (e: any) {
                // error
            }
        };
        if (showModal)
            getDmList();
    }, [showModal]);

    if (showModal) {
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