// 게임 정보 interface

export interface ball {
    y: number,
    x: number,
    dy: number,
    dx: number
}

export interface score {
    player1: number,
    player2: number
}

export interface gamePosInfo {
    player1: number,
    player2: number,
    ball: ball,
    score: score
}