import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../common/states/contextSocket";
import {Stack } from "../../common/styles/Stack.style";
import useGetData from "../../util/useGetData";
import DifficultyButtons from "../../components/game/DifficultyButtons";
import Loader from "../../components/util/Loader";
import { REACT_APP_HOST, RoutePath } from "../../common/configData";
import useCheckLogin from "../../util/useCheckLogin";
import { ContentBox } from "../../common/styles/ContentBox.style";
import { toast } from "react-toastify";

function GameMatchPage() {
    useCheckLogin();
    const [loading, setLoading] = useState<boolean>(true);
    const [current, setCurrent] = useState<string>("");
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (myInfo) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        if (current !== "") {
            setLoading(false);
        }
    }, [current]);

    useEffect(() => {
        socket.on('matchMakeSuccess', (data: {p1: string, p2: string}) => {
            socket.off('matchMakeSuccess');
            navigate(`/game/match/${data.p1}vs${data.p2}`, {state: {
                player1: data.p1,
                player2: data.p2,
                current: current,
                invite: false
            }});
        });
        socket.on("matchFail", () => {
            toast.error("게임 매칭 실패!");
            socket.off('matchFail');
            navigate(RoutePath.lobby);
        })
        return (() => {
            socket.off('matchMakeSuccess');
            socket.off('matchFail');
        })
    }, [current, socket, navigate]);

    let currentDifficulty: number = 0;

    /* 매치 메이킹 */
    function handleMatchMakeRequest(e: React.MouseEvent<HTMLElement>) {
        socket.emit('requestMatchMake', {
            difficulty: currentDifficulty,
            player: current
        });
        setLoading(true);
    }

    function setDifficulty(difficulty: number) {
        currentDifficulty = difficulty;
    }

    /* 매칭 취소 이벤트 */
    function requestCancelHander(e: React.MouseEvent<HTMLElement>) {
        navigate(RoutePath.lobby);
    }

    return (
        <ContentBox><Stack>
        {loading ? <><Loader text="로딩중"/><button onClick={requestCancelHander}>게임 매칭 취소</button></> : 
            <>
            <h1>👾 Choose Game Level 👾</h1>
            <DifficultyButtons difficulty={currentDifficulty} setDifficulty={setDifficulty}/>
            <button onClickCapture={handleMatchMakeRequest}> 게임 매칭 요청 </button>
            </>
        }
        </Stack></ContentBox>
    )
}

export default GameMatchPage;