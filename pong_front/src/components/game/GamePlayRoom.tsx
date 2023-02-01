import React, {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../states/contextSocket";
import {useLocation, Link} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../states/recoilGameState"
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import GameRoom from "./GameRoom";
import { OverLay, Wrapper } from "../../styles/Modal";
import * as types from "./Game";

function GamePlayRoom(props: any) {
    /* 유저 정보 변수들 */
    // TODO - 게임이 시작되면 프로필 수정 버튼? 을 비활성해야 함 (만약 있다면..)
    const location = useLocation();
    const player1 = location.state.player1;
    const player2 = location.state.player2;
    //const player1 = "pingpong_king"; // TODO - 소켓 연결되면 주석처리
    //const player2 = "loser";
    const currentPlayer = "pingpong_king"; // TODO - 실제로 받아올 것
    const isP1 = player1 === currentPlayer;
    const gameRoomName = `${player1}vs${player2}`;

    /* state */
    const [winner, setWinner] = useState<string>();

    /* 게임 정보 setter */
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);

    /* 변수들 */
    const playerSpeed = 10;

    /* socket */
    const socket = useContext(SocketContext);

    /* Event Handler */
    const keyDownHandler = (e: KeyboardEvent) => {
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

    function testHandler(e: any) {
        console.log('0000', gameRoomName);
        socket.emit("requestStart", gameRoomName);
    }

    useEffect(() => {
        // TODO - 핸들러 달아주기
        window.addEventListener("keydown", keyDownHandler);
        // TODO - 시작 이벤트 듣기
        socket.on("startGame", (data: any) => {
            socket.on("ballPos", (data: types.gamePosInfo) => {
                setGame(data);
            })
            socket.on("endGame", (data) => {
                setWinner(data.winner);
            })
        })
    }, []);

    return (
        <Center>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <Button className="game-button" onClick={testHandler}>
                    게임 시작
                </Button>
            </Stack>
            {winner ? 
            <OverLay z_index={100}>
                <Wrapper>
                {winner === currentPlayer ? 
                <div>
                    <div>Win!!</div>
                    {/* 이미지 추가 */}
                </div> : 
                <div>
                    <div>Lose!!</div>
                    {/* 이미지 추가 */}
                </div>
                }
                <Link to="/lobby"><Button>Go To Lobby</Button></Link>
            </Wrapper>
        </OverLay> : null}
        </Center>
    );
}

export default GamePlayRoom;