import React, {useEffect, useRef, useState, useCallback} from "react";
import { useLocation } from "react-router-dom";
import {Center, Stack} from "../../styles/Layout";
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {drawBall, drawNet, drawPaddle} from './GameEngine/draw'
import {updateBall} from './GameEngine/update'
import {colors, sizes} from "./GameEngine/variables"
import { getMaxListeners } from "process";

function GameRoom(props: any) {

    interface ball {
        y: number,
        x: number,
        dy: number,
        dx: number
    }

    interface gameInfo {
        player1: number,
        player2: number,
        ball: ball
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [gamePos, setGamePos] = useState<gameInfo>({
    //     player1: sizes.canvasHeight / 2,
    //     player2: sizes.canvasHeight / 2,
    //     ball: {
    //         y: sizes.canvasHeight / 2,
    //         x: sizes.canvasWidth / 2,
    //         dy: 2,
    //         dx: Math.random() > 0.5 ? 3 : -3
    //     }
    // });

    const [p1, setP1] = useState<number>(sizes.canvasHeight / 2);
    const [p2, setP2] = useState<number>(sizes.canvasHeight / 2);
    const [by, setBy] = useState<number>(sizes.canvasHeight / 2);
    const [bx, setBx] = useState<number>(sizes.canvasWidth / 2);
    const [bdy, setBdy] = useState<number>(2);
    const [bdx, setBdx] = useState<number>(Math.random() > 0.5 ? 3 : -3);

    const location = useLocation();
    const player1 = location.state.player1;
    const currentPlayer = "pingpong_king";  // TODO - 현재 유저의 ID를 받아올것
    // const currentPlayer = "loser";  // TODO - 현재 유저의 ID를 받아올것

    let speed: number = 5;

    useEffect(() => {
        console.log("draw");
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawNet(ctx);
                drawPaddle(ctx, 0, p1, colors.p1Color);
                drawPaddle(ctx, sizes.canvasWidth, p2, colors.p2Color);
                drawBall(ctx, bx, by);
                // TODO 마저그려요
            }
        }
    }, [p1, p2, by, bx, bdy, bdx]);

    useEffect(() => {
        // TODO - 본인이 왼쪽(player1)유저인지 오른쪽(player2)유저인지에 따라서 ball의 방향 반대로 바꿔주기
        document.addEventListener("keydown", keyDown);
        return () => {
            document.removeEventListener("keydown", keyDown);
            // window.removeEventListener("keyup", () => setPressedKey(""));
        };
    }, [])

    useEffect(() => {
        console.log("reeee");
    })

    function keyDown(e: KeyboardEvent) {
        e.preventDefault();
        if (e.key === "ArrowUp")
            movePaddle(-1);
        else if (e.key === "ArrowDown")
            movePaddle(1);
    }

    function movePaddle(move: number) {
        if (currentPlayer === player1) {
            const temp = p1 + move;
            const new_pos = (temp >= sizes.paddleSize && temp <= sizes.canvasHeight - sizes.paddleSize) ? temp : p1;
            console.log(`newPos: ${new_pos}`);
            if (new_pos !== p1) {
                setP1(new_pos);
                // setGamePos(newGamePos);
                // setGamePos((current) => {
                //     let newGamePos = {...current};
                //     newGamePos.player1 = new_pos;
                //     return newGamePos;
                // })
            }
        }
        else {
            // const temp = gamePos.player2 + move;
            // const new_pos = (temp >= sizes.paddleSize && temp <= sizes.canvasHeight - sizes.paddleSize) ? temp : gamePos.player2;
            // if (new_pos !== gamePos.player2) {
            //     setGamePos({...gamePos, player2: new_pos});
            // }
        }
    }

    return (
        <Center>
            <Stack>
                <div>this is gameroom</div>
                {/* <GameScore /> */}
                {/* <GameUsers/> */}
                <canvas id="gameCanvas" width={sizes.canvasWidth} height={sizes.canvasHeight} style={{background: colors.backgroudColor}} ref={canvasRef} tabIndex={0}></canvas>
            </Stack>
        </Center>
    );
}

export default GameRoom;