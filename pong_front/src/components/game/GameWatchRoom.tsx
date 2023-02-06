import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../states/recoilGameState"
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import GameRoom from "./GameRoom";
import { SocketContext } from "../../states/contextSocket";
import { OverLay, Wrapper } from "../../styles/Modal";
import * as types from "./Game";

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
        <Center>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <Button onClick={endHandler} className="game-button">
                    관전 종료
                </Button>
            </Stack>
            {winner ? 
            <OverLay z_index={100}>
                <Wrapper>
                <div>Winner is {winner}!</div>
                <Link to="/lobby"><Button>Go To Lobby</Button></Link>
            </Wrapper>
        </OverLay> : null}
        </Center>
    );
}

export default GameWatchRoom;