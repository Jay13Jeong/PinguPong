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
    // TODO - 프로필 이미지?
    myProfile: boolean;     // 내 프로필인지
    // userStatus: boolean;    // 접속 상태 // TODO - 상태 구체화 필요 (오프라인, 온라인, 게임중)
    userStatus: string;     // on, off, game // TODO - type을 정의해서 쓰고 싶음..
    rank: number;           // 랭크
    odds: number;           // 승률
    record: Record[];       // 전적
    // 본인 정보가 아닐 경우에 추가되는 정보
    following?: boolean;    // 팔로우 중인지
    block?: boolean;        // 차단했는지
}

export interface Friend {
    userId: number;         // TODO - friend 프로필로 들어가기 위한 id
    userName: string;
    // userStatus: boolean;    // TODO - 상태 구체화 필요
    userStatus: string;     // on, off, game // TODO - type을 정의해서 쓰고 싶음..
}