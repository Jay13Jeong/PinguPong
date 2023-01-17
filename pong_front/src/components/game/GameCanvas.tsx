import React, {useRef, useState, useEffect} from 'react';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {player1Pos, player2Pos, ballPos, gamePos} from '../../recoil/gamePos'
import { Center, Stack } from '../../styles/Layout';

function GameCanvas(props: any) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const setPlayer1Pos = useSetRecoilState(player1Pos);
    const setPlayer2Pos = useSetRecoilState(player2Pos);
    const setBallPos = useSetRecoilState(ballPos);
    const getGamePos = useRecoilValue(gamePos);

    var canvasWidth: number; // FIXME : undefined (업데이트가 안되고 있음)
    var canvasHeight: number;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context)
                setCtx(context);
            canvas.width = window.innerWidth / 2;
            canvas.height = window.innerHeight / 2;
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            setPlayer1Pos(canvasWidth / 2);
            setPlayer2Pos(canvasHeight / 2);
            setBallPos({y: canvas.height / 2, x: canvas.width / 2, dir: 1}); // speed....
        }
    }, []);

    function handleArrowKey(move: number) {
        // console.log(getGamePos.player1);
        const currentPlayer1Pos = getGamePos.player1 + move;
        setPlayer1Pos(currentPlayer1Pos); // FIXME : canvas 범위 확인을 위해 아래 주석 조건문 안으로 들어가야 함...
        // if (currentPlayer1Pos >= 0 && currentPlayer1Pos <= canvasHeight) {
        //     console.log(currentPlayer1Pos);
        //     setPlayer1Pos(currentPlayer1Pos);
        // }
    }

    function canvasKeyHandler(e: any) {
        if (e.key === "ArrowUp")
            handleArrowKey(1);
        else if (e.key === "ArrowDown")
            handleArrowKey(-1);
    }

    // FIXME : canvas에 자동 포커스 
    return (
        <Center>
            <Stack>
            {getGamePos.player1 ? <div>{getGamePos.player1}</div> : <div>NULL</div>}
            <canvas id="gameCanvas" style={{background: "grey"}} ref={canvasRef} onKeyDown={canvasKeyHandler} tabIndex={0}>
            </canvas>
            </Stack>
        </Center>
    );
}

export default GameCanvas