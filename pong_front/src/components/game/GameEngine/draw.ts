import {colors, sizes} from "../GameEngine/variables"

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
    ctx.moveTo(xPos, yPos - sizes.paddleSize);
    ctx.lineTo(xPos, yPos + sizes.paddleSize);
    ctx.stroke();
}

