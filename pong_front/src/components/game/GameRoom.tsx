import { useEffect, useRef} from "react";
import {colors, sizes} from "../../common/configData";
import {drawNet,drawPaddle, drawBall} from "../game/GameEngine/draw";
import {useRecoilValue} from "recoil";
import {gameState} from "../../common/states/recoilGameState"
import * as types from "../../common/types/Game";
import "./GameCanvas.scss";

const GameRoom = (props: {p1: string, p2: string}) => {
    // TODO - 연결 전 로딩 state, endGame state도 설정해야 함.
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /* state */
    const game = useRecoilValue<types.gamePosInfo>(gameState);

    useEffect(() => {
        drawGame();
    }, [game]);

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

    return (
        <div className="game-grid">
                <div className="player-name">{props.p1}</div>
                <div className="player-name">{props.p2}</div>
                <div className="score">{game.score.player1}</div>
                <div className="score">{game.score.player2}</div>
            <canvas className="game-canvas" 
                ref={canvasRef}
                width={sizes.canvasWidth} 
                height={sizes.canvasHeight} 
                style={{background: colors.backgroudColor}}></canvas>
        </div>
    );
}
export default GameRoom;