import { atom } from "recoil";
import { sizes } from "../../common/configData";
import * as T from "../../common/types/Game";

export const gameState = atom<T.gamePosInfo>({
    key: "gamestate",
    default: {
        player1: sizes.canvasHeight / 2 - sizes.paddleSize / 2,
        player2: sizes.canvasHeight / 2 - sizes.paddleSize / 2,
        ball: {
            y: sizes.canvasHeight / 2,
            x: sizes.canvasWidth / 2,
            dy: 2,
            dx: Math.random() > 0.5 ? 3 : -3
        },
        score: {
            player1: 0,
            player2: 0
        }
    }
})