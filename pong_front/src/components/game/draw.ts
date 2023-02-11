import {colors, sizes} from "../../common/configData";

export function drawNet(ctx: CanvasRenderingContext2D) {
    ctx.beginPath(); 
    ctx.strokeStyle = colors.gameColor;
    ctx.lineWidth = sizes.lineWidth / 2;
    ctx.moveTo(sizes.canvasWidth / 2, 0);
    ctx.lineTo(sizes.canvasWidth / 2, sizes.canvasHeight);
    ctx.stroke();
}

export function drawPaddle(
        ctx: CanvasRenderingContext2D,
        xPos: number, 
        yPos: number, 
        color: string) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = sizes.lineWidth;
    ctx.moveTo(xPos, yPos);
    ctx.lineTo(xPos, yPos + sizes.paddleSize);
    ctx.stroke();
}

export function drawBall(ctx: CanvasRenderingContext2D, xPos: number, yPos: number) {
    ctx.beginPath();
    ctx.strokeStyle = colors.ballColor;
    ctx.arc(xPos, yPos, sizes.lineWidth / 2, 0, 2 * Math.PI);
    ctx.lineWidth = 0;
    ctx.stroke();
}

