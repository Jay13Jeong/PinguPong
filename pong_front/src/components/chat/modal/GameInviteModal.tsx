import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { gameInviteModalState } from "../../../common/states/recoilModalState";
import useGetData from "../../../util/useGetData";
import { REACT_APP_HOST } from "../../../common/configData";
import ModalBase from "../../modal/ModalBase";
import { useNavigate } from "react-router-dom";
import Loader from "../../util/Loader";
import { toast } from "react-toastify";

function GameInviteModal (props: {targetID: number, targetUserName: string, setInviteInfo: Function}) {
    const socket = useContext(SocketContext);
    const [current, setCurrent] = useState("");
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [loading, setLoading] = useState(true);
    const modalState = useRecoilValue(gameInviteModalState);
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
        socket.on('matchMakeSuccess', (data: {p1: string, p2: string}) => {
            socket.off('matchMakeSuccess');
            socket.off('duelTargetRun');
            props.setInviteInfo({id: -1, username: ""});
            resetState();
            navigate(`/game/match/${props.targetUserName}vs${current}`, {state: {
                player1: data.p1,
                player2: data.p2,
                current: current,
                invite: false
            }});
        });
        socket.on('duelTargetRun', (username: string) => {
            socket.off('duelTargetRun');
            socket.off('matchMakeSuccess');
            toast.error("🔥 결투 상대가 게임을 나갔습니다!");
            props.setInviteInfo({id: -1, username: ""});
            resetState();
        })
    }
    function rejectHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('duelAccept', {targetId: props.targetID, result: false});
        props.setInviteInfo({id: -1, username: ""});
        resetState();
    }
    if (modalState) {
        return (
            <ModalBase open={modalState} reset={resetState} z_index={100}>
                {loading ? <Loader/> : 
                    <>
                    <h2>{props.targetUserName}의 도전 신청</h2>
                    <button onClick={acceptHandler}>수락</button>
                    <button onClick={rejectHandler}>거절</button>
                    </>
                }
            </ModalBase>
        );
    }
    return null;
}

export default GameInviteModal;