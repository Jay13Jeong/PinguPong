import { Injectable, Inject } from '@nestjs/common';
import { Socket } from 'socket.io';

class BattleClass{
    private player1Id:string;//socketid
    private player2Id:string;
    private player1socket:Socket;
    private player2socket:Socket;
    private roomName:string;
    private player1Ready:boolean;
    private player2Ready:boolean;


    private sizes = {
        canvasWidth: 800,
        canvasHeight: 500,
        lineWidth: 12,
        paddleSize: 100
    };

    private counter:ReturnType<typeof setInterval> | undefined;
    private goal:number;
    private speed:number

    private game = {
        player1: this.sizes.canvasHeight / 2,    // p1의 y좌표
        player2: this.sizes.canvasHeight / 2,    // p2의 y좌표
        ball: {
            y: this.sizes.canvasHeight / 2,
            x: this.sizes.canvasWidth / 2,
            dy: 4,
            dx: Math.random() > 0.5 ? 4 : -4
        },
        score: {
            player1: 0,
            player2: 0
        }
    }

    //게임마다 고유키
        //각 게임마다 가지고 있어야 할 것들, 공, 플레이어1,2 좌표
    public constructor(roomName:string, player1Id:string, player2Id:string){//, pingGateway: pingGateway){
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.roomName = roomName;
        //this.pingGateway = pingGateway;

        this.player1Ready = false;
        this.player2Ready = false;

        this.goal = 100;
        this.speed = 1;
    }

    /* 일정 시간마다 게임 동작 함수 실행 */
    public gameStart () {
        this.counter = setInterval(this.gameRun, 1000 * 0.02);
    //api:clearInterval(counter)함수를 쓰면 setInterval를 종료할 수 있다.
    }

    /* 게임 동작 함수 */
    private gameRun() {
        // 1. 공 움직이고 (방향전환, 점수 검사)
        this.ballMove();
        // 2. 바뀐 게임 정보들 보내준다. (플레이어와 관전자 모두에게 보내주기)
        //this.pingGateway.putBallPos(this.player1Id, this.game);
        this.player1socket.to(this.player1Id).emit("ballPos", this.game);
        this.player2socket.to(this.player2Id).emit("ballPos", this.game);
        // 3. 공 움직이기 (위치 변화)
        this.game.ball.y += this.game.ball.dy * this.speed;
        this.game.ball.x += this.game.ball.dx * this.speed;
        // 4. 게임 종료 여부도 확인해서 보내주기
        if (this.goal === this.game.score.player1 || this.goal === this.game.score.player2) {
            // 이긴 사람만 winner에 넣어서 보내줍니다.
            this.player1socket.to(this.player1Id).emit("endGame", {winner: this.goal === this.game.score.player1 ? this.game.score.player1 : this.game.score.player2});
            this.player2socket.to(this.player2Id).emit("endGame", {winner: this.goal === this.game.score.player1 ? this.game.score.player1 : this.game.score.player2});
            // TODO - 🌟 전적 정보를 저장해야 한다면 여기서 저장하기 🌟
            clearInterval(this.counter); // 반복 종료
        }
    }

/* 공 움직이는 함수 - 반사, 점수 획득 */
    private ballMove() {
        const p1PaddleStart = this.game.player1;
        const p1PaddleEnd = this.game.player1 + this.sizes.paddleSize;
        const p2PaddleStart = this.game.player2;
        const p2PaddleEnd = this.game.player2 + this.sizes.paddleSize;
        if (this.game.ball.y < 0 || this.game.ball.y > this.sizes.canvasHeight) {  // 위아래 벽에 튕김
            this.game.ball.dy *= -1;
        }
        if (this.game.ball.x > this.sizes.canvasWidth - this.sizes.lineWidth) {    // 오른쪽(p2네) 벽으로 돌진
            if (this.game.ball.y < p2PaddleStart || this.game.ball.y > p2PaddleEnd) { // 패들 너머로 간 경우
                // 초기화
                this.game.ball.y = this.sizes.canvasHeight / 2;
                this.game.ball.x = this.sizes.canvasWidth / 2;
                this.game.ball.dy = 4;
                this.game.ball.dx = Math.random() > 0.5 ? 4 : -4;
                // p1의 점수를 올린다.
                this.game.score.player1++;
            }
            else {  // p2의 패들에 튕김
                this.game.ball.dx *= -1;
            }
        }
        else if (this.game.ball.x < this.sizes.lineWidth) {   // 왼쪽(p1네) 벽으로 돌진
            if (this.game.ball.y < p1PaddleStart || this.game.ball.y > p1PaddleEnd) { // 패들 너머로 간 경우
                // 초기화
                this.game.ball.y = this.sizes.canvasHeight / 2;
                this.game.ball.x = this.sizes.canvasWidth / 2;
                this.game.ball.dy = 4;
                this.game.ball.dx = Math.random() > 0.5 ? 4 : -4;
                // p2의 점수를 올린다.
                this.game.score.player2++;
            }
            else {  // p1의 패들에 튕김
                this.game.ball.dx *= -1;
            }
        }
    }

    //사용자가 레디 눌렀는지 확인하기
    public requestStart(socket:Socket, socketid:string) {
        if (this.player1Id == socketid){
            this.player1Ready = true;
            this.player1socket = socket;
        }
        if (this.player2Id == socketid){
            this.player2Ready = true;
            this.player2socket = socket;
        }
        if (this.player1Ready && this.player2Ready){
            this.player1socket.to(this.player1Id).emit('startGame');//여기서 소켓 메시지보내기
            this.player2socket.to(this.player2Id).emit('startGame');
            this.gameStart()
        }
    }

    //플레이어 이동시에 값 반영
    public playerMove(whoplayer:string, offset:string) {
        
        switch(whoplayer){
        case '1':
            const newPos1 = this.game.player1 + Number(offset);
            if (newPos1 >= 0 && newPos1 <= this.sizes.canvasHeight - this.sizes.paddleSize)
                this.game.player1 = newPos1;
        case '2':
            const newPos2 = this.game.player2 + Number(offset);
            if (newPos2 >= 0 && newPos2 <= this.sizes.canvasHeight - this.sizes.paddleSize)
                this.game.player2 = newPos2;
        }
    }
}

@Injectable()
export class GameService {
    private vs : Map<string, BattleClass>;
    private socketid : Map<string, string>;//소켓id : 유저Id
    private easyLvUserList : Set<string>;
    private normalLvUserList : Set<string>;
    private hardLvUserList : Set<string>;

    public constructor(){
        this.vs = new Map<string, BattleClass>();
        this.socketid = new Map<string, string>();
        this.easyLvUserList = new Set<string>();
        this.normalLvUserList = new Set<string>();
        this.hardLvUserList = new Set<string>();
    }

    //유저를 매칭시키는 함수만들기
        //유저가 플레이어 몇인지 이때 할당하기
    public matchMake(difficulty:string, player:string, socketid:string):boolean{
        this.socketid.set(socketid, player);
        if (difficulty == '0'){
            this.easyLvUserList.add(socketid);
            return this.createCheck(this.easyLvUserList, socketid);
        }
        else if (difficulty == '1'){
            this.normalLvUserList.add(socketid);
            return this.createCheck(this.normalLvUserList, socketid);
        }
        else if (difficulty == '2'){
            this.hardLvUserList.add(socketid);
            return this.createCheck(this.hardLvUserList, socketid);
        }
        return false;
    }

    //소켓id로 관리를 하자.
    private createCheck(UserList:Set<string>, player1:string):boolean{
        let player2:string;

        if (UserList.size >= 2) {//대기열이 2명이상이면 매칭후 방 만들기
            UserList.delete(player1);
            player2 = UserList[0];
            UserList.delete(player2);
            let roomName:string = this.socketid.get(player1) + this.socketid.get(player2);
            this.vs.set(roomName, new BattleClass(roomName, player1, player2));
            //여기서 사용자들에게 어떻게 보내줄 것인가?
            return true;
        }
        return false;
    }


    //해당 유저가 준비완료를 했는지 확인하는 함수
    //방이름 유저소켓id를 받아서 둘다 준비완료이면 메세지 보내기
    public requestStart(roomName:string, socket:Socket, socketid:string) {
        const vs:BattleClass = this.vs.get(roomName);

        vs.requestStart(socket, socketid);
    }

    //플레이어의 게임동작을 확인하는 함수 만들기
    //방이름 유저소켓id offset으로 값 넣어주기
    public playerMove(whoplayer:string, roomName:string, offset:string){
        const vs:BattleClass = this.vs.get(roomName);

        vs.playerMove(whoplayer, offset);
        
    }
}
