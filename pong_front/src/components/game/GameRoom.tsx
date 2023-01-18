import React, {useEffect} from "react";
import GameCanvas from "./GameCanvas";
import {Center, Stack} from "../../styles/Layout";
import {useSetRecoilState} from 'recoil';
import {gamePos} from '../../recoil/gamePos'
import {sizes} from "./GameEngine/variables"

function GameRoom(props: any) {

    const setGamePosState = useSetRecoilState(gamePos);
    let pressdKey: string = "";

    let player1Pos: number = sizes.canvasHeight / 2;
    let player2Pos: number = sizes.canvasHeight / 2;
    let ballPosY: number = 0;
    let ballPosX: number = 0;
    let ballDir: number = 0;

    function setPressedKey(keyCode: string) {
        pressdKey = keyCode;
        if (pressdKey === "ArrowUp")
            movePaddle(-1);
        else if (pressdKey === "ArrowDown")
            movePaddle(1);
    }

    function setGamePos(p1: number, p2: number, y: number, x: number, dir: number) {
        // 로컬 변수 업데이트
        player1Pos = p1;
        player2Pos = p2;
        ballPosY = y;
        ballPosX = x;
        ballDir = dir;
        // recoil state 업데이트
        setGamePosState({player1: player1Pos, player2: player2Pos, ball: {y: ballPosY, x: ballPosX, dir: ballDir}});
        // emit
    }

    useEffect(() => {
        // window에 이벤트 리스너 달아주기
        window.addEventListener("keydown", (e) => {
            e.preventDefault();
            setPressedKey(e.key);
        });
        window.addEventListener("keyup", () => setPressedKey(""));
    });

    useEffect(() => {
        setGamePos(sizes.canvasHeight / 2, sizes.canvasHeight / 2, sizes.canvasHeight / 2, sizes.canvasWidth / 2, 1);
    }, [])

    function movePaddle(move: number) {
        const temp = player1Pos + move;
        const new_pos = (temp >= sizes.paddleSize && temp <= sizes.canvasHeight - sizes.paddleSize) ? temp : player1Pos;
        if (new_pos !== player1Pos) {
            setGamePos(new_pos, player2Pos, ballPosY, ballPosX, ballDir);
        }
    }

    return (
        <Center>
            <Stack>
                <div>this is gameroom</div>
                {/* <GameScore /> */}
                {/* <GameUsers/> */}
                <GameCanvas width={sizes.canvasWidth} height={sizes.canvasHeight}/>
            </Stack>
        </Center>
    );
}

export default GameRoom;