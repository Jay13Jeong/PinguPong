import React, {useRef, useState, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {gamePos} from '../../recoil/gamePos'
import {drawBall, drawNet, drawPaddle} from './GameEngine/draw'
import {colors, sizes} from "./GameEngine/variables"

function GameCanvas(props: {width: number, height: number}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const getGamePos = useRecoilValue(gamePos);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context)
                setCtx(context);
            canvas.width = sizes.canvasWidth;
            canvas.height = sizes.canvasHeight;
        }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && ctx) {
            drawNet(ctx);
            drawPaddle(ctx, 0, getGamePos.player1, colors.p1Color);
            drawPaddle(ctx, sizes.canvasWidth, getGamePos.player2, colors.p2Color);
            drawBall(ctx, getGamePos.ball.x, getGamePos.ball.y);
        }
    }, [ctx, getGamePos]);

    return (
        <canvas id="gameCanvas" style={{background: colors.backgroudColor}} ref={canvasRef} tabIndex={0}>
        </canvas>
    );
}

export default GameCanvas