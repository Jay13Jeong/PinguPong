import {atom} from 'recoil';

export interface ball {
    y: number,
    x: number,
    dy: number,
    dx: number
};

export interface gameInfo {
    player1: number,
    player2: number,
    ball: ball
};

export const gamePos = atom<gameInfo>({
    key: 'gamePos',
    default: {
        player1: 0,
        player2: 0,
        ball: {
            y: 0,
            x: 0,
            dy: 0,
            dx: 0
        }
    }
});
