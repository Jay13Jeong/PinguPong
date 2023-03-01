import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate, Link, useParams} from "react-router-dom";
import {useSetRecoilState, useResetRecoilState} from "recoil";
import { toast } from "react-toastify";

import {gameState} from "../../common/states/recoilGameState";
import { SocketContext } from "../../common/states/contextSocket";
import { RoutePath } from "../../common/configData";
import { Stack } from "../../common/styles/Stack.style";
import { ContentBox } from "../../common/styles/ContentBox.style";
import * as types from "../../common/types/Game";
import GameRoom from "../../components/game/GameRoom";
import { OverLay, Wrapper } from "../../components/modal/Modal.style";
import useCheckLogin from "../../util/useCheckLogin";
import Loader from "../../components/util/Loader";

function GameWatchRoomPage() {
    useCheckLogin();

    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const [winner, setWinner] = useState<string>();
    const resetGame = useResetRecoilState(gameState);

    useEffect(() => {
        if (!location) {
            toast.error("존재하지 않는 게임입니다!");
            navigate(RoutePath.lobby);
        }
        socket.emit('gameRoomCheck', id);
        socket.on('gameRoomCheck', (result) => {
            socket.off('gameRoomCheck');
            if (result === true) {
                player1 = location.state.player1;
                player2 = location.state.player2;
                socket.emit('watchGame', id);
            }
            else {
                toast.error("존재하지 않는 게임입니다!");
                navigate(RoutePath.lobby);
            }
        })
        return (() => {
            socket.off('gameRoomCheck');
        })
    }, []);

    useEffect(() => {
        socket.on("ballPos", (data: types.gamePosInfo) => {
            setGame(data);
        })
        socket.on("endGame", (data: {winner: string}) => {
            setWinner(data.winner);
        })
        return (() => {
            socket.off("ballPos");
            socket.off("endGame");
        })
    }, [socket, setGame]);

    useEffect(() => {
        return (() => {
            resetGame();
        })
    }, [resetGame]);

    let player1: string | undefined;
    let player2: string | undefined;

    function endHandler(e: React.MouseEvent<HTMLButtonElement>) {
        socket.emit('stopwatchGame', `${player1}vs${player2}`);
        navigate(RoutePath.lobby);
    }

    return (
        <ContentBox>
            {player1 && player2 ? 
            <>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <button onClick={endHandler} className="game-button">
                    관전 종료
                </button>
            </Stack>
            {winner ? 
            <OverLay z_index={100}>
                <Wrapper>
                    <div>Winner is {winner}!</div>
                    <Link to={RoutePath.lobby}><button>Go To Lobby</button></Link>
                </Wrapper>
            </OverLay> : null}
            </>
            : <Loader text="게임 로딩 중"/>}
        </ContentBox>
    );
}

export default GameWatchRoomPage;