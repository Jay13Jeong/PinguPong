export interface Record {
    idx: number;
    p1: string;
    p2: string;
    p1Score: number;
    p2Score: number;
}

export interface User {
    id: number;
    avatar? : string;
    userName: string;       // 유저 이름
    myProfile: boolean;     // 내 프로필인지
    // userStatus: boolean;    // 접속 상태
    userStatus: string;
    rank: number;           // 랭크
    odds: number;           // 승률
    record: Record[];       // 전적
    // 본인 정보가 아닐 경우에 추가되는 정보
    following?: boolean;    // 팔로우 중인지
    block?: boolean;        // 차단했는지
    relate?: string; //api에서 받아온 차단 및 친구 상태. accepted, blocked, pending.
}

export interface Friend {
    userId: number;
    me?: User;
    you?: User;
    relate?: string; //차단, 친구추가 수락대기, 친구.
    userName: string;
    // userStatus: boolean;
    userStatus: string;
}