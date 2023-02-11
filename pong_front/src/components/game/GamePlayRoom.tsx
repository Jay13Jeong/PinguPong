import React, {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../common/states/contextSocket";
import {useLocation, Link} from "react-router-dom";
import {useSetRecoilState, useResetRecoilState} from "recoil";
import {gameState} from "../../common/states/recoilGameState";
import { Stack } from "../../common/styles/Layout";
import GameRoom from "./GameRoom";
import { OverLay, Wrapper } from "../modal/Modal.style";
import * as types from "../../common/types/Game";
import { toast } from "react-toastify";
import CustomToastContainer from "../util/CustomToastContainer";

function GamePlayRoom() {
    const [winner, setWinner] = useState<string>();
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const resetGame = useResetRecoilState(gameState);
    const socket = useContext(SocketContext);
    const location = useLocation();

    useEffect(() => {
        // TODO - 핸들러 달아주기
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        // TODO - 시작 이벤트 듣기
        socket.on("startGame", () => {
            socket.off("startGame");
            socket.on("ballPos", (data: types.gamePosInfo) => {
                setGame(data);
            })
            
        })
        socket.on("endGame", (data: {winner: string}) => {
            console.log("hahahahah end");
            socket.off("ballPos");
            socket.off("endGame");
            setWinner(data.winner);
        })
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            socket.off("ballPos");
            socket.off("endGame");
            resetGame();
        };
    }, []);
    
    const player1 = location.state.player1;
    const player2 = location.state.player2;
    const currentPlayer = location.state.current;
    const isP1 = player1 === currentPlayer;
    const gameRoomName = `${player1}vs${player2}`;
    const playerSpeed = 10;
    
    /* Event Handler */
    const keyDownHandler = (e: KeyboardEvent) => {
        console.log('0000', isP1 , "current" , currentPlayer);
        if (e.key === "ArrowUp") {
            if (isP1) { // 1번을 위로
                socket.emit("player1Move", -playerSpeed, gameRoomName);
            }
            else { // 2번을 위로
                socket.emit("player2Move", -playerSpeed, gameRoomName);
            }
        }
        else if (e.key === "ArrowDown") {
            if (isP1) { // 1번을 아래로
                socket.emit("player1Move", playerSpeed, gameRoomName);            
            }
            else { // 2번을 아래로
                socket.emit("player2Move", playerSpeed, gameRoomName);    
            }
        }
    }

    function readyHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit("requestStart", gameRoomName);
    }

    function beforeUnloadHandler(e: BeforeUnloadEvent) {
        e.preventDefault();
        e.returnValue = "";
        toast.error("게임 중에는 불가합니다!");
    }

    return (
        <>
        <CustomToastContainer/>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <button className="game-button" onClick={readyHandler}>
                    게임 준비
                </button>
            </Stack>
            {winner ? 
            <OverLay z_index={100}>
                <Wrapper>
                {winner === currentPlayer ? 
                <div>
                    <div>Win!!</div>
                </div> : 
                <div>
                    <div>Lose!!</div>
                </div>
                }
                <Link to="/lobby"><button>Go To Lobby</button></Link>
            </Wrapper>
        </OverLay> : null}
        </>
    );
}

export default GamePlayRoom;