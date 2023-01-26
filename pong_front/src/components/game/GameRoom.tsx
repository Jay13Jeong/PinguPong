import React, {useState, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import { Center } from "../../styles/Layout";
import { Button } from "../../styles/Inputs"
import {colors, sizes} from "../game/GameEngine/variables";
import {drawNet,drawPaddle, drawBall} from "../game/GameEngine/draw";
import io from "socket.io-client";
import "./GameCanvas.scss";

const GameRoom = (props: {type: string}) => {

    // 참가 유저 정보 // TODO - 게임이 시작되면 프로필 수정 버튼? 을 비활성해야 함 (만약 있다면..)
    const location = useLocation();
    // const player1 = location.state.player1;
    // const player2 = location.state.player2;
    const player1 = "pingpong_king"; // TODO - 소켓 연결되면 주석처리
    const player2 = "loser";
    // const currentPlayer = "pingpong_king"; // TODO - 실제로 받아올 것
    const currentPlayer = "pingpong_king";
    const isP1 = player1 === currentPlayer;
    // const isP1 = false;

    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    // TODO - 연결 전 로딩 state, endGame state도 설정해야 함.


//     // 게임 정보 interface
interface ball {
    y: number,
    x: number,
    dy: number,
    dx: number
}

interface score {
    player1: number,
    player2: number
}

interface gamePosInfo {
    player1: number,
    player2: number,
    ball: ball,
    score: score
}

    // canvas 그리기를 위한 ref
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 변수들
    let game: gamePosInfo = {
        player1: sizes.canvasHeight / 2 - sizes.paddleSize / 2,
        player2: sizes.canvasHeight / 2 - sizes.paddleSize / 2,
        ball: {
            y: sizes.canvasHeight / 2,
            x: sizes.canvasWidth / 2,
            dy: 2,
            dx: Math.random() > 0.5 ? 3 : -3
        },
        score: {
            player1: 0,
            player2: 0
        }
    }
    const playerSpeed = 10;

    // socket
    const ENDPOINT = "http://localhost:3001";
    const socket = io(ENDPOINT, {
        transports: ['websocket'],
        withCredentials: true,
    });

    // SECTION

    useEffect(() => {
        // NOTE - 반드시 한번만 리스너를 등록해줘야 함.
        if (props.type === "player")
            window.addEventListener("keydown", keyDownHandler);
        // NOTE - 상호 연결 확인 후 초깃값으로 draw하는게 좋을듯?
        socket.on("startGame", (data: any) => {
            drawGame();
            // NOTE - Game
            socket.on("ballPos", (data: gamePosInfo) => {
                console.log("ball update");
                game.player1 = data.player1;
                game.player2 = data.player2;
                game.ball.y = data.ball.y;
                game.ball.x = data.ball.x;
                game.ball.dy = data.ball.dy;
                game.ball.dx = data.ball.dx;
                game.score.player1 = data.score.player1;
                game.score.player2 = data.score.player2;
                drawGame();
                if (p1Score !== game.score.player1)
                    setP1Score(game.score.player1);
                else if (p2Score !== game.score.player2)
                    setP2Score(game.score.player2);
            })
            socket.on("endGame", (data) => {
                console.log(data);
            })
        })

    }, []);

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            if (isP1) { // 1번을 위로
                let newPos = game.player1 - playerSpeed;
                if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
                    game.player1 = newPos;
                // 보내주기
                socket.emit("player1Move", game);
            }
            else { // 2번을 위로
                let newPos = game.player2 - playerSpeed;
                if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
                    game.player2 = newPos;
                // 보내주기
                socket.emit("player2Move", game);
            }
        }
        else if (e.key === "ArrowDown") {
            if (isP1) { // 1번을 아래로
                let newPos = game.player1 + playerSpeed;
                if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
                    game.player1 = newPos;
                // 보내주기
                socket.emit("player1Move", game);            
            }
            else { // 2번을 아래로
                let newPos = game.player2 + playerSpeed;
                if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
                    game.player2 = newPos;
                // 보내주기
                socket.emit("player2Move", game);    
            }
        }
    }

    // !SECTION

    // SECTION : 이후에 분리할 업데이트 함수들

    function drawGame() {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // 본격 그리기 가능
                ctx.clearRect(0, 0, sizes.canvasWidth, sizes.canvasHeight);
                drawNet(ctx);
                drawPaddle(ctx, 0, game.player1, colors.p1Color);
                drawPaddle(ctx, sizes.canvasWidth, game.player2, colors.p2Color);
                drawBall(ctx, game.ball.x, game.ball.y);
            }
        }
    }

    function testHandler(e: any) {
        socket.emit("requestStart");
    }

    return (
        <Center>
                <div className="game-grid">
                    <div className="player-name">{player1}</div>
                    <div className="player-name">{player2}</div>
                    <div className="score">{p1Score}</div>
                    <div className="score">{p2Score}</div>
                <canvas className="game-canvas" 
                    ref={canvasRef}
                    width={sizes.canvasWidth} 
                    height={sizes.canvasHeight} 
                    style={{background: colors.backgroudColor}}></canvas>
                {props.type === "player" ? <Button className="game-button" onClick={testHandler}>
                    게임 시작
                </Button> : null}
                
                </div>
                
        </Center>
    );
}
export default GameRoom;