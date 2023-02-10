import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../states/contextSocket";
import { useNavigate, useLocation } from "react-router-dom";
import GamePlayRoom from "../../components/game/GamePlayRoom";
import Loader from "../../components/util/Loader";
import { Button } from "../../styles/Inputs";
import { toast } from "react-toastify";

function GamePlayRoomPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        if (location.state.invite === true) {
            socket.on('matchMakeSuccess', (data: {p1: string, p2: string}) => {
                socket.off('matchMakeSuccess');
                setLoading(false);
            });
            socket.on('duelTargetRun', (username: string) => {
                socket.off('duelTargetRun');
                toast.error("🔥 결투 신청이 거절당했습니다!");
                navigate('/lobby');
            })
        }
        else {
            setLoading(false);
        }
        return (() => {
            socket.off('matchMakeSuccess');
            socket.off('duelTargetRun');
        });
    }, [location.state.invite]);
    
    function duelRunHander(e: React.MouseEvent<HTMLElement>) {
        // let targetId:number = data.targetId;
        socket.emit('duelRequestRun', {targetId: location.state.targetId});
        socket.off('matchMakeSuccess');
        navigate('/lobby');
    }

    return (
        loading ? 
        <>
        <Loader/>
        <Button onClick={duelRunHander}>초대 취소</Button>
        </> : 
        <GamePlayRoom/>
    );
}

export default GamePlayRoomPage;