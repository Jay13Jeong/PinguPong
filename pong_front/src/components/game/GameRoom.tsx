import { useEffect, useRef} from "react";
import {colors, sizes} from "../../common/configData";
import {drawNet,drawPaddle, drawBall} from "./draw";
import {useRecoilValue} from "recoil";
import {gameState} from "../../common/states/recoilGameState"
import * as types from "../../common/types/Game";

import { Grid, Stack, Typography} from "@mui/material";

const GameRoom = (props: {p1: string, p2: string}) => {
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
        <Stack>
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={6}>
                <Typography className="player-name" variant="subtitle2" align="center">{props.p1}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography className="player-name" variant="subtitle2" align="center">{props.p2}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography className="score" variant="h3" align="center">{game.score.player1}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography className="score" variant="h3" align="center">{game.score.player2}</Typography>
            </Grid>
        </Grid>
            <canvas
                ref={canvasRef}
                width={sizes.canvasWidth} 
                height={sizes.canvasHeight} 
                style={{background: colors.backgroudColor}}></canvas>
        </Stack>
    );
}
export default GameRoom;