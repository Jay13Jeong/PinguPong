export interface record {
    idx: number;
    p1: string;
    p2: string;
    p1Score: number;
    p2Score: number;
}

export interface user {
    userName: string;       // 유저 이름
    // TODO - 프로필 이미지?
    myProfile: boolean;     // 내 프로필인지
    userStatus: boolean;    // 접속 상태
    rank: number;           // 랭크
    odds: number;           // 승률
    record: record[];       // 전적
}