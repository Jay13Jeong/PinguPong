import React, {useEffect} from "react";
import GameCanvas from "./GameCanvas";
import {Center, Stack} from "../../styles/Layout";
import {useSetRecoilState} from 'recoil';
import {gamePos} from '../../recoil/gamePos'

function GameRoom(props: any) {

    const setGamePosState = useSetRecoilState(gamePos);
    let canvasWidth: number;
    let canvasHeight: number;

    let player1Pos: number = 0;
    let player2Pos: number = 0;
    let ballPosY: number = 0;
    let ballPosX: number = 0;
    let ballDir: number = 0;

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
        // FIXME : canvasWidth, canvasHeight 값이 유지되지 않음
        // Window 사이즈에 따른 캔버스 크기 설정
        canvasWidth = window.innerWidth / 2;
        canvasHeight = window.innerHeight / 2;
    }, []);

    function handleArrowKey(move: number) {
        setGamePos(player1Pos + move, player2Pos, ballPosY, ballPosX, ballDir);
    }

    /**
     * TODO : 핸들러 위치 고민
     * 현재는 핸들러를 canvas에 등록하고 있음
     * 그래서 canvas 밖으로 나가면 핸들러가 작동하지 않음
     * 이게 맞을까요
     */
    function canvasKeyHandler(e: any) {
        if (e.key === "ArrowUp")
            handleArrowKey(1);
        else if (e.key === "ArrowDown")
            handleArrowKey(-1);
    }

    return (
        <Center>
            <Stack>
                <div>this is gameroom</div>
                {/* <GameScore /> */}
                {/* <GameUsers/> */}
                <GameCanvas keyHander={canvasKeyHandler}/>
            </Stack>
        </Center>
    );
}

export default GameRoom;