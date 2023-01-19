import { time, timeEnd } from "console";
import React, {useState, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import { Center } from "../../styles/Layout";
import {colors, sizes} from "../game/GameEngine/variables";
import {drawNet,drawPaddle, drawBall} from "../game/GameEngine/draw";
// import {keyDownHandler} from "../game/GameEngine/key";
// import { useRecoilState } from "recoil";
// import { gamePos, gamePosInfo } from "../game/GameEngine/state";
import "./GameCanvas.scss";

const GameRoom = () => {

    // 참가 유저 정보 // TODO - 게임이 시작되면 프로필 수정 버튼? 을 비활성해야 함 (만약 있다면..)
    const location = useLocation();
    // const player1 = location.state.player1;
    // const player2 = location.state.player2;
    const player1 = "pingpong_king"; // TODO - 소켓 연결되면 주석처리
    const player2 = "loser";

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

    // 게임 정보 state
    // const game = useRecoilValue(gamePos);
    // const [game, setGame] = useState(gamePos);
    // const [game, setGame] = useRecoilState(gamePos);

    const [game, setGame] = useState<gamePosInfo>({
        player1: sizes.canvasHeight / 2,
        player2: sizes.canvasHeight / 2,
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
    });

    // canvas 그리기를 위한 ref
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 변수들
    let start: number | undefined = undefined;
    let previousTimeStamp: number | undefined = undefined;

    // SECTION

    useEffect(() => {
        const render = () => {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        // 본격 그리기 가능
                        // console.log(`pos: ${game.player1}, ${game.player2}`);
                        ctx.clearRect(0, 0, sizes.canvasWidth, sizes.canvasHeight); // NOTE - 이렇게 지워야 한다면 굳이 위치 정보를 상태로 관리할 필요가 없음.
                        drawNet(ctx);
                        drawPaddle(ctx, 0, game.player1, colors.p1Color);
                        drawPaddle(ctx, sizes.canvasWidth, game.player2, colors.p2Color);
                        drawBall(ctx, game.ball.x, game.ball.y);
                        updateBall();
                    }
                }
        }
        window.requestAnimationFrame(render);
    }, [game]);

    useEffect(() => {
        // NOTE - 반드시 초기 마운트시에"만" 이벤트 리스너를 등록해야 함
        // 아니면 계속...리스너가 추가된다.
        window.addEventListener("keydown", keyDownHandler);
    }, []);

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            setGame((prev: gamePosInfo) => {
                return {
                    ...prev,
                    player1: prev.player1 - 10
                }
            })
        }
        else if (e.key === "ArrowDown") {
            setGame((prev: gamePosInfo) => {
                return {
                    ...prev,
                    player1: prev.player1 + 10
                }
            })
        }
    }

    // !SECTION

    // SECTION : 이후에 분리할 업데이트 함수들
    function updateBall() {
        let newX = game.ball.x + game.ball.dx * 1;
        let newY = game.ball.y + game.ball.dy * 1;
        let newDY = game.ball.dy;
        if (newX < 0) {
            console.log("player1 win!");
            setGame((prev: gamePosInfo) => {
                return {
                    ...prev,
                    ball: {
                        x: sizes.canvasWidth / 2,
                        y: sizes.canvasHeight / 2,
                        dy: newDY,
                        dx: Math.random() > 0.5 ? 3 : -3
                    },
                    score: {
                        ...prev.score,
                        player1: prev.score.player1 + 1
                    }
                }
            })
        }
        else if (newX > sizes.canvasWidth) {
            console.log("player2 win!");
            setGame((prev: gamePosInfo) => {
                return {
                    ...prev,
                    ball: {
                        x: sizes.canvasWidth / 2,
                        y: sizes.canvasHeight / 2,
                        dy: newDY,
                        dx: Math.random() > 0.5 ? 3 : -3
                    },
                    score: {
                        ...prev.score,
                        player2: prev.score.player2 + 1
                    }
                }
            })
        }
        else if (newY < 0 || newY > sizes.canvasHeight) {
            newDY = -newDY;
        }
        setGame((prev: gamePosInfo) => {
            return {
                ...prev,
                ball: {
                    ...prev.ball,
                    x: newX,
                    y: newY,
                    dy: newDY
                }
            }
        })
    }
    // !SECTION


    return (
        <Center>
                <div className="gameGrid">
                    <div className="playerName">{player1}</div>
                    <div className="playerName">{player2}</div>
                    <div className="score">{game.score.player1}</div>
                    <div className="score">{game.score.player2}</div>
                <canvas className="gameCanvas" 
                    ref={canvasRef}
                    width={sizes.canvasWidth} 
                    height={sizes.canvasHeight} 
                    style={{background: colors.backgroudColor}}></canvas>
                </div>
        </Center>
    );
}
export default GameRoom;