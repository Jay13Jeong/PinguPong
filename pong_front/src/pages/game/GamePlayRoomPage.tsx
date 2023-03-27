import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../common/states/contextSocket";
import { useNavigate, useLocation } from "react-router-dom";
import GamePlayRoom from "../../components/game/GamePlayRoom";
import { toast } from "react-toastify";
import useCheckLogin from "../../util/useCheckLogin";
import { RoutePath } from "../../common/configData";

import { Typography } from "@mui/material";

import { DefaultBox, DefaultButton, DefaultLinearProgress } from "../../components/common";

function GamePlayRoomPage() {
    useCheckLogin();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        if (!location.state) {
            navigate(RoutePath.lobby);
        }
        else if (location.state.invite === true) {
            socket.on('matchMakeSuccess', (data: {p1: string, p2: string}) => {
                socket.off('matchMakeSuccess');
                setLoading(false);
            });
            socket.on('duelTargetRun', (username: string) => {
                socket.off('duelTargetRun');
                toast.error("🔥 결투 신청이 거절당했습니다!");
                navigate(RoutePath.lobby);
            })
        }
        else {
            setLoading(false);
        }
        return (() => {
            socket.off('matchMakeSuccess');
            socket.off('duelTargetRun');
        });
    }, [location.state]);
    
    function duelRunHander(e: React.MouseEvent<HTMLElement>) {
        // let targetId:number = data.targetId;
        socket.emit('duelRequestRun', {targetId: location.state.targetId});
        socket.off('matchMakeSuccess');
        navigate(RoutePath.lobby);
    }

    return (
        <DefaultBox>
            {loading ? 
            <>
            <Typography variant="subtitle1">대기중...</Typography>
            <DefaultLinearProgress/>
            <DefaultButton onClick={duelRunHander}>초대 취소</DefaultButton>
            </> : 
            <GamePlayRoom/>}
        </DefaultBox>
    );
}

export default GamePlayRoomPage;