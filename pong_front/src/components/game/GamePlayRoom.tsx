import React, {useState, useEffect, useContext} from "react";
import {useLocation, Link, useNavigate} from "react-router-dom";
import {useSetRecoilState, useResetRecoilState} from "recoil";
import { toast } from "react-toastify";

import { SocketContext } from "../../common/states/contextSocket";
import {gameState} from "../../common/states/recoilGameState";
import { Stack } from "../../common/styles/Stack.style";
import * as types from "../../common/types/Game";
import { RoutePath } from "../../common/configData";
import GameRoom from "./GameRoom";
import { OverLay, Wrapper } from "../modal/Modal.style";

function GamePlayRoom() {
    const [winner, setWinner] = useState<string>();
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const resetGame = useResetRecoilState(gameState);
    const socket = useContext(SocketContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);
        (() => {
            window.addEventListener("beforeunload", beforeUnloadHandler);
        })();
        (() => {
            window.history.pushState(null, "", window.location.href);
            window.addEventListener("popstate", preventGoBack);
        })();
        socket.on("startGame", () => {
            socket.off("startGame");
            socket.on("ballPos", (data: types.gamePosInfo) => {
                setGame(data);
            })
        })
        socket.on("endGame", (data: {winner: string}) => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            window.removeEventListener('popstate', preventGoBack);
            socket.off("ballPos");
            socket.off("endGame");
            setWinner(data.winner);
        })
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            window.removeEventListener('popstate', preventGoBack);
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
        if (e.key === "ArrowUp") {
            if (isP1) { // 1?????? ??????
                socket.emit("player1Move", -playerSpeed, gameRoomName);
            }
            else { // 2?????? ??????
                socket.emit("player2Move", -playerSpeed, gameRoomName);
            }
        }
        else if (e.key === "ArrowDown") {
            if (isP1) { // 1?????? ?????????
                socket.emit("player1Move", playerSpeed, gameRoomName);            
            }
            else { // 2?????? ?????????
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
        navigate(RoutePath.lobby);
    }

    function preventGoBack(e: any) {
        window.history.pushState(null, "", window.location.href);
        toast.error("?????? ?????? ???????????????!");
    }

    return (
        <>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <button className="game-button" onClick={readyHandler}>
                    ?????? ??????
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
                <Link to={RoutePath.lobby}><button>Go To Lobby</button></Link>
            </Wrapper>
        </OverLay> : null}
        </>
    );
}

export default GamePlayRoom;