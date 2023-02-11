import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../common/states/recoilGameState";
import { Stack } from "../../common/styles/Layout";
import GameRoom from "./GameRoom";
import { SocketContext } from "../../common/states/contextSocket";
import { OverLay, Wrapper } from "../modal/Modal.style";
import * as types from "../../common/types/Game";

function GameWatchRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const [winner, setWinner] = useState<string>();

    const player1 = location.state.player1;
    const player2 = location.state.player2;

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

    function endHandler(e: React.MouseEvent<HTMLButtonElement>) {
        socket.emit('stopwatchGame', `${player1}vs${player2}`);
        navigate('/lobby');
    }

    return (
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
                <Link to="/lobby"><button>Go To Lobby</button></Link>
            </Wrapper>
        </OverLay> : null}
        </>
    );
}

export default GameWatchRoom;