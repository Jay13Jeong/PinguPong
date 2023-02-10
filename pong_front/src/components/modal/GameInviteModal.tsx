import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { SocketContext } from "../../states/contextSocket";
import { gameInviteModalState } from "../../states/recoilModalState";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST } from "../../util/configData";
import ModalBase from "./ModalBase";
import { Button } from "../../styles/Inputs";
// import { userState } from "../../states/recoilUserState";
import { useNavigate } from "react-router-dom";
import Loader from "../util/Loader";

function GameInviteModal (props: {targetID: number, targetUserName: string, setInviteInfo: Function}) {
    const socket = useContext(SocketContext);
    const [current, setCurrent] = useState("");
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const [loading, setLoading] = useState(true);
    const modalState = useRecoilValue(gameInviteModalState);
    // const userInfoState = useRecoilValue(userState);
    const resetState = useResetRecoilState(gameInviteModalState);
    const navigate = useNavigate();

    useEffect(() => {
        if (myInfo) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        if (current !== "") {
            setLoading(false);
        }
        else
            setLoading(true);
    }, [current]);

    function acceptHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('duelAccept', {targetId: props.targetID, result: true});
        props.setInviteInfo({id: -1, username: ""});
        navigate(`/game/match/${props.targetUserName}vs${current}`, {state: {
            player1: props.targetUserName,
            player2: current,
            current: current,
            invite: false
        }});
    }
    function rejectHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('duelAccept', {targetId: props.targetID, result: false});
        props.setInviteInfo({id: -1, username: ""});
        resetState()
    }
    if (modalState) {
        return (
            <ModalBase reset={resetState} z_index={100}>
                {loading ? <Loader/> : 
                    <>
                    <h2>${props.targetUserName}의 도전 신청</h2>
                    <Button onClick={acceptHandler}>수락</Button>
                    <Button onClick={rejectHandler}>거절</Button>
                    </>
                }
            </ModalBase>
        );
    }
    return null;
}

export default GameInviteModal;