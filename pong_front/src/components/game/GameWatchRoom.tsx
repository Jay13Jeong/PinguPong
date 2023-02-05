import React, {useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../states/recoilGameState"
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import GameRoom from "./GameRoom";
import { SocketContext } from "../../states/contextSocket";
import * as types from "./Game";

function GameWatchRoom(props: any) {
    /* 유저 정보 변수들 */
    const location = useLocation();
    const navigate = useNavigate();

    /* 소켓 */
    const socket = useContext(SocketContext);

    const player1 = location.state.player1;
    const player2 = location.state.player2;

    /* 게임 정보 setter */
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);

    useEffect(() => {
        socket.on("ballPos", (data: types.gamePosInfo) => {
            setGame(data);
        })
        socket.on("endGame", (data) => {
            // TODO - 게임 종료 이벤트 발생시 종료 화면 띄우기
            console.log(data);
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
        </Center>
    );
}

export default GameWatchRoom;