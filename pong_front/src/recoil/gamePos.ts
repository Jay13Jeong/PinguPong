import {atom, selector} from 'recoil';

// player 1 state
export const player1Pos = atom<number>({
    key: 'player1pos',
    default: 0
});
// player 2 state
export const player2Pos = atom<number>({
    key: 'player2pos',
    default: 0
});
// ball state
interface ball {
    y: number,
    x: number,
    dir: number
};

export const ballPos = atom<ball>({
    key: 'ballpos',
    default: {
        y: 0,
        x: 0,
        dir: 0
    }
})
// selector (player 1, player 2, ball state 모두 반환하는 get)
interface gameInfo {
    player1: number,
    player2: number,
    ball: ball
};

export const gamePos = selector({
    key: 'gamePos',
    get: ({get}) => {
        var currentGameInfo: gameInfo = {
            player1: 0,
            player2: 0,
            ball: {
                y: 0,
                x: 0,
                dir: 0
            }
        };
        currentGameInfo.player1 = get(player1Pos);
        currentGameInfo.player2 = get(player2Pos);
        currentGameInfo.ball = get(ballPos);
        return currentGameInfo;
    }
});