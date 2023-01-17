import {atom} from 'recoil';

interface ball {
    y: number,
    x: number,
    dir: number
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
            dir: 0
        }
    }
});
