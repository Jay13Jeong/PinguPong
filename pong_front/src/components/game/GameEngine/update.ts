import {sizes} from "../GameEngine/variables"
import {ball} from '../../../recoil/gamePos'

export function updateBall(p1: number, p2: number, currentBall: ball) {
    let newX = currentBall.x + currentBall.dx * 5;
    let newY = currentBall.y + currentBall.dy * 5;
    let newDY = currentBall.dy;
    if (newX < 0) {
        console.log("p1 win!");
        newX = sizes.canvasWidth / 2;
        newY = sizes.canvasHeight / 2;
    }
    else if (newX > sizes.canvasWidth) {
        console.log("p2 win!");
        newX = sizes.canvasWidth / 2;
        newY = sizes.canvasHeight / 2;
    }
    else if (newY < 0 || newY > sizes.canvasHeight) {
        newDY = -newDY;
    }
    // updateState(p1, p2, currentBall.y, currentBall.x, currentBall.dy, currentBall.dx);
}