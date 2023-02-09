import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { GameDto } from './game.dto';
import { Game } from './game.entity';

type p1p2 ={
    p1:string,
    p2:string
}

class BattleClass{
    private player1Id:string;//socketid
    private player2Id:string;
    private player1Name:string;
    private player2Name:string;
    private player1socket:Socket;
    private player2socket:Socket;
    private roomName:string;
    private player1Ready:boolean;
    private player2Ready:boolean;
    private myserver:Server;
    // private userService: UsersService;
    // private create;
    
    private watchUser:Set<Socket>;


    private sizes={//:{canvasWidth:number, canvasHeight: number, lineWidth: number, paddleSize: number} = {
        canvasWidth: 800,
        canvasHeight: 500,
        lineWidth: 12,
        paddleSize: 100
    };

    private counter:ReturnType<typeof setInterval> | undefined;
    private goal:number;
    private speed:number

    private game = {//:{player1:number, player2:number, ball:{y:number, x:number, dy:number, dx:number}, score:{player1:number, player2:number}} = {
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
    public constructor(
        player1Id: string,
        player1: string,
        player2Id: string,
        player2: string,
        speed: number,
        private gameRepo: Repository<Game>,
        private readonly usersService: UsersService,
        ){
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.player1Name = player1;
        this.player2Name = player2;
        // this.create = create;
        // this.userService = userService;
        // console.log("123", this.usersService, userService);


        this.roomName = player1 + 'vs' + player2;
        //this.pingGateway = pingGateway;

        this.watchUser= new Set<Socket>();
        this.player1Ready = false;
        this.player2Ready = false;

        this.goal = 5;
        this.speed = speed;

        this.counter = undefined;
    }

    //디비에 전적을 저장하는 메소드.
    private async create(gameDTO: GameDto) : Promise<Game> {
        if (gameDTO.winner == gameDTO.loser) {
            throw new BadRequestException('승자와 패자가 동일');
        }
        const winner = await this.usersService.findUserById(gameDTO.winner);
        const loser = await this.usersService.findUserById(gameDTO.loser);

        if (!winner || !loser) {
            throw new NotFoundException('처리 할 대상이 존재하지 않음');
        }
        if (gameDTO.winnerScore < 0 || gameDTO.loserScore < 0) {
            throw new BadRequestException('양수가 아닌 점수');
        }
        //소켓이 끊긴 게임은 dto에서 승자에게 매우 큰점 수를 주도록 한다.
        if (gameDTO.loserScore > gameDTO.winnerScore)
            throw new BadRequestException('패자의 점수가 더 큼');

        //전적기록을 디비에 저장.
        const game = this.gameRepo.create({
            loser: loser,
            winner: winner,
            draw: (gameDTO.winnerScore == gameDTO.loserScore),
            loserScore: gameDTO.loserScore,
            winnerScore: gameDTO.winnerScore,
            mode: gameDTO.mode,
        });

        //승패를 디비에 갱신.
        if (game.draw == false) {
            ++loser.loses;
            ++winner.wins;
            this.usersService.save(loser);
            this.usersService.save(winner);
        }
        return this.gameRepo.save(game);
    }

    public matchEmit(server:Server){
        server.to(this.player1Id).emit('matchMakeSuccess', {p1: this.player1Name, p2: this.player2Name});
        server.to(this.player2Id).emit('matchMakeSuccess', {p1: this.player1Name, p2: this.player2Name});
    }

    public async startGame(server:Server): Promise<void>{
        if (this.counter != undefined)//게임 중인지 확인하기
            return ;
        console.log('startGame');
        this.myserver = server;
        await this.gameStart();
    }

    /* 공 움직이는 함수 - 반사, 점수 획득 */
    // private ballMove(qwe:string):void {
    //     console.log('ballMove+++++++++++', qwe);
    //     const p1PaddleStart = this.game.player1;
    //     const p1PaddleEnd = this.game.player1 + this.sizes.paddleSize;
    //     const p2PaddleStart = this.game.player2;
    //     const p2PaddleEnd = this.game.player2 + this.sizes.paddleSize;
    //     if (this.game.ball.y < 0 || this.game.ball.y > this.sizes.canvasHeight) {  // 위아래 벽에 튕김
    //         this.game.ball.dy *= -1;
    //     }
    //     if (this.game.ball.x > this.sizes.canvasWidth - this.sizes.lineWidth) {    // 오른쪽(p2네) 벽으로 돌진
    //         if (this.game.ball.y < p2PaddleStart || this.game.ball.y > p2PaddleEnd) { // 패들 너머로 간 경우
    //             // 초기화
    //             this.game.ball.y = this.sizes.canvasHeight / 2;
    //             this.game.ball.x = this.sizes.canvasWidth / 2;
    //             this.game.ball.dy = 4;
    //             this.game.ball.dx = Math.random() > 0.5 ? 4 : -4;
    //             // p1의 점수를 올린다.
    //             this.game.score.player1++;
    //         }
    //         else {  // p2의 패들에 튕김
    //             this.game.ball.dx *= -1;
    //         }
    //     }
    //     else if (this.game.ball.x < this.sizes.lineWidth) {   // 왼쪽(p1네) 벽으로 돌진
    //         if (this.game.ball.y < p1PaddleStart || this.game.ball.y > p1PaddleEnd) { // 패들 너머로 간 경우
    //             // 초기화
    //             this.game.ball.y = this.sizes.canvasHeight / 2;
    //             this.game.ball.x = this.sizes.canvasWidth / 2;
    //             this.game.ball.dy = 4;
    //             this.game.ball.dx = Math.random() > 0.5 ? 4 : -4;
    //             // p2의 점수를 올린다.
    //             this.game.score.player2++;
    //         }
    //         else {  // p1의 패들에 튕김
    //             this.game.ball.dx *= -1;
    //         }
    //     }
    // }

    /* 일정 시간마다 게임 동작 함수 실행 */
    private async gameStart ():Promise<void> {
        console.log('gameStart------------');
        let me = await this.gameRun.bind(this);
        this.counter = setInterval(me, 1000 * 0.02);
        
    //api:clearInterval(counter)함수를 쓰면 setInterval를 종료할 수 있다.
    }

    /* 게임 동작 함수 */
    private async gameRun(): Promise<void> {
        // 1. 공 움직이고 (방향전환, 점수 검사)
        const p1PaddleStart:number = this.game.player1;
        const p1PaddleEnd:number = this.game.player1 + this.sizes.paddleSize;
        const p2PaddleStart:number = this.game.player2;
        const p2PaddleEnd:number = this.game.player2 + this.sizes.paddleSize;
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
        }//여기까지 ballMove함수 내용

        // 2. 바뀐 게임 정보들 보내준다. (플레이어와 관전자 모두에게 보내주기)
        //this.pingGateway.putBallPos(this.player1Id, this.game);
        this.myserver.to(this.roomName).emit("ballPos", this.game);
        //this.myserver.to(this.player2Id).emit("ballPos", this.game);
        //console.log('ballpos', this.player1Id, this.player2Id);

        // 3. 공 움직이기 (위치 변화)
        this.game.ball.y += this.game.ball.dy * this.speed;
        this.game.ball.x += this.game.ball.dx * this.speed;
        // 4. 게임 종료 여부도 확인해서 보내주기
        if (this.goal === this.game.score.player1 || this.goal === this.game.score.player2) {
            // 이긴 사람만 winner에 넣어서 보내줍니다.
            this.myserver.to(this.roomName).emit("endGame", {winner: this.goal === this.game.score.player1 ? this.player1Name : this.player2Name});
            //this.player2socket.to(this.player2Id).emit("endGame", {winner: this.goal === this.game.score.player1 ? this.game.score.player1 : this.game.score.player2});
            // TODO - 🌟 전적 정보를 저장해야 한다면 여기서 저장하기 🌟
            this.player1socket.leave(this.roomName);
            this.player2socket.leave(this.roomName);
            for (let socket of this.watchUser.keys())
                socket.leave(this.roomName);
            clearInterval(this.counter); // 반복 종료
            const winner : User = await this.usersService.findUserByUsername(this.goal === this.game.score.player1 ? this.player1Name : this.player2Name);
            const loser : User = await this.usersService.findUserByUsername(this.goal !== this.game.score.player1 ? this.player1Name : this.player2Name);
            // console.log("444", winner);
            const history : GameDto = { //전적 기록.
                winner : winner.id,
                loser : loser.id,
                winnerScore : this.goal === this.game.score.player1 ? this.game.score.player1 : this.game.score.player2,
                loserScore : this.goal !== this.game.score.player1 ? this.game.score.player1 : this.game.score.player2
            };
            await this.create(history);// 디비에 전적 저장.
        }
    }

    public iGameLoser(loserid:string):string{
        this.myserver.to(this.roomName).emit("endGame", {winner: this.player1Id !== loserid ? this.player1Name : this.player2Name});
        clearInterval(this.counter);
        console.log("endGame", this.player1Id === loserid ? this.player1Name : this.player2Name);
        return this.player1Id === loserid ? this.player1Id : this.player2Id;
    }

    //사용자가 레디 눌렀는지 확인하기
    public requestStart(socket:Socket, server:Server):boolean {
        if (this.counter != undefined)//게임이 시작중인지 확인하기
            return ;
        if (this.player1Id == socket.id){
            this.player1Ready = true;
            this.player1socket = socket;
            socket.join(this.roomName);
            //console.log('player1sockerRoom', socket.rooms);
        }
        if (this.player2Id == socket.id){
            this.player2Ready = true;
            this.player2socket = socket;
            socket.join(this.roomName);
            //console.log('player2sockerRoom', socket.rooms);
        }
        if (this.player1Ready && this.player2Ready){
            server.to(this.roomName).emit('startGame');//여기서 소켓 메시지보내기
            //this.player2socket.to(this.player1Id).emit('startGame');소켓이 to로 자기자신에게는 메세지를 못 보낸다.
            //socket.to(this.roomName).emit('startGame');//2번쨰 누르는 사람은 못 받음,서버가 아닌 소켓이 룸에 보낼때는 브로드캐스팅인것 같다.

            console.log('startGame');
            return true;
        }
        return false;
    }

    //플레이어 이동시에 값 반영
    public playerMove(whoplayer:string, offset:string) {
        
        switch(whoplayer){
        case '1':
            const newPos1 = this.game.player1 + Number(offset);
            if (newPos1 >= 0 && newPos1 <= this.sizes.canvasHeight - this.sizes.paddleSize)
                this.game.player1 = newPos1;
            break;
        case '2':
            const newPos2 = this.game.player2 + Number(offset);
            if (newPos2 >= 0 && newPos2 <= this.sizes.canvasHeight - this.sizes.paddleSize)
                this.game.player2 = newPos2;
            break;
        }
    }

    public getUsers():p1p2{
        return {p1:this.player1Name, p2:this.player2Name};
    }

    public watchGame(client:Socket) {
        this.watchUser.add(client);
    }

    public stopwatchGame(client:Socket) {
        this.watchUser.delete(client);
    }
}

@Injectable()
export class GameService {
    private vs : Map<string, BattleClass>;//rooms
    private socketid : Map<string, string>;//소켓id : 유저name
    private easyLvUserList : Set<string>;//소켓 id
    private normalLvUserList : Set<string>;
    private hardLvUserList : Set<string>;
    private socketidRoomname : Map<string, string>;//socketid: roomName

    public constructor(
        @InjectRepository(Game) private gameRepo: Repository<Game>,
		private usersService: UsersService,
    ) {
        this.vs = new Map<string, BattleClass>();
        this.socketid = new Map<string, string>();
        this.easyLvUserList = new Set<string>();
        this.normalLvUserList = new Set<string>();
        this.hardLvUserList = new Set<string>();
        this.socketidRoomname = new Map<string, string>();
    }

    async test(){
        // console.log(this.usersService);
        return await this.usersService.findUserById(1);
    }

    public getRoomList():Array<p1p2>{
        let arr:p1p2[]= [];

        for (let room of Array.from(this.vs.keys()))
            arr.push(this.vs.get(room).getUsers());

        return arr;
    }

    public checkGaming(socketId: string):boolean {
        if (this.easyLvUserList.has(socketId) === true)
            return true;
        if (this.normalLvUserList.has(socketId) === true)
            return true;
        if (this.hardLvUserList.has(socketId) === true)
            return true;
        //추가로 this.socketidRoomname.has(socketId)도 확인할 수 있도록 해야 한다.
        return false;
    }

    public iGamegetout(client:Socket){
        if (!this.socketidRoomname.has(client.id)) {//대결중이 아니면 종료
            this.socketid.delete(client.id);
            this.easyLvUserList.delete(client.id);//매칭중에 새로고침을 할 경우
            this.normalLvUserList.delete(client.id);
            this.hardLvUserList.delete(client.id);
            return ;
        }
        //대결 중에 한명이 새로고침을 할경우 , but BattleClass이 이미 지웠지만, 다른 사용자가 새로고침할 경우 문제가 생길 수 있다
        const roomName:string = this.socketidRoomname.get(client.id);
        const vs:BattleClass = this.vs.get(roomName);

        console.log('iGamegetout', roomName);
        if (vs != undefined){//but BattleClass이 이미 지웠지만, 다른 사용자가 새로고침할 경우 문제가 생길 수 있다
            let winner:string = vs.iGameLoser(client.id);//이긴 사람의 소켓 id
            this.socketidRoomname.delete(winner);
        }
        this.socketidRoomname.delete(client.id);
        this.socketid.delete(client.id);
        this.vs.delete(roomName);//방 지우기
    }

    //유저를 매칭시키는 함수만들기
        //유저가 플레이어 몇인지 이때 할당하기
    public matchMake(difficulty:string, player:string, socketid:string): boolean{
        this.socketid.set(socketid, player);
        if (difficulty == '0'){
            this.easyLvUserList.add(socketid);
            return this.createCheck(this.easyLvUserList, socketid, 1);
        }
        else if (difficulty == '1'){
            this.normalLvUserList.add(socketid);
            return this.createCheck(this.normalLvUserList, socketid, 1.5);
        }
        else if (difficulty == '2'){
            this.hardLvUserList.add(socketid);
            return this.createCheck(this.hardLvUserList, socketid, 2);
        }
        return false;
    }

    //소켓id로 관리를 하자.
    private createCheck(UserList:Set<string>, player1:string, speed:number): boolean{
        let player2:string;
        if (UserList.size >= 2) {//대기열이 2명이상이면 매칭후 방 만들기
            UserList.delete(player1);
            player2 = Array.from(UserList)[0];
            UserList.delete(player2);
            let roomName:string = this.socketid.get(player1) + 'vs' + this.socketid.get(player2);
            // console.log("333", await this.usersService.findUserById(1));
            this.vs.set(roomName, new BattleClass(player1, this.socketid.get(player1), player2, this.socketid.get(player2), speed, this.gameRepo, this.usersService));
            this.socketidRoomname.set(player1, roomName);
            this.socketidRoomname.set(player2, roomName);
            console.log('createRoom', roomName);
            return true;
        }
        return false;
    }

    public duelRequest(userSocketId:string, userName:string, targetSocketId:string, targetName:string) {
        let roomName:string = userName + 'vs' + targetName;
        this.vs.set(roomName, new BattleClass(userSocketId, userName, targetSocketId, targetName, 1.5, this.gameRepo, this.usersService));
        this.socketid.set(userSocketId, userName);
        this.socketid.set(targetSocketId, targetName);
        this.socketidRoomname.set(userName, roomName);
        this.socketidRoomname.set(targetName, roomName);
        console.log('creatreDuelRoom', roomName);
    }

    public duelDelete(userSocketId:string, userName:string, targetSocketId:string, targetName:string){
        let roomName:string = this.socketidRoomname.get(userSocketId);
        this.socketid.delete(userSocketId);
        this.socketid.delete(targetSocketId);
        this.socketidRoomname.delete(userName);
        this.socketidRoomname.delete(targetName);
        this.vs.delete(roomName);
    }

    public matchEmit(server:Server, socketid:string) {
        const vs:BattleClass = this.vs.get(this.socketidRoomname.get(socketid));

        vs.matchEmit(server);
    }

    //해당 유저가 준비완료를 했는지 확인하는 함수
    //방이름 유저소켓id를 받아서 둘다 준비완료이면 메세지 보내기
    public requestStart(roomName:string, socket:Socket, server:Server):boolean {
        const vs:BattleClass = this.vs.get(roomName);
        return vs.requestStart(socket, server);
    }

    public async startGame(roomName:string, server:Server){
        const vs:BattleClass = this.vs.get(roomName);
        await vs.startGame(server);
    }

    //플레이어의 게임동작을 확인하는 함수 만들기
    //방이름 유저소켓id offset으로 값 넣어주기
    public playerMove(whoplayer:string, roomName:string, offset:string){
        const vs:BattleClass = this.vs.get(roomName);

        vs.playerMove(whoplayer, offset);
        
    }

    public watchGame(roomName:string, client:Socket) {
        const vs:BattleClass = this.vs.get(roomName);

        vs.watchGame(client);
    }

    public stopwatchGame(roomName:string, client:Socket) {
        const vs:BattleClass = this.vs.get(roomName);

        vs.stopwatchGame(client);
    }
    
    //디비에 전적을 저장하는 서비스.
    async create(gameDTO: GameDto) : Promise<Game> {
		if (gameDTO.winner == gameDTO.loser) {
			throw new BadRequestException('승자와 패자가 동일');
		}
		const winner = await this.usersService.findUserById(gameDTO.winner);
		const loser = await this.usersService.findUserById(gameDTO.loser);

		if (!winner || !loser) {
			throw new NotFoundException('처리 할 대상이 존재하지 않음');
		}
		if (gameDTO.winnerScore < 0 || gameDTO.loserScore < 0) {
			throw new BadRequestException('양수가 아닌 점수');
		}
        //소켓이 끊긴 게임은 dto에서 승자에게 매우 큰점 수를 주도록 한다.
		if (gameDTO.loserScore > gameDTO.winnerScore)
			throw new BadRequestException('패자의 점수가 더 큼');

        //전적기록을 디비에 저장.
		const game = this.gameRepo.create({
			loser: loser,
			winner: winner,
			draw: (gameDTO.winnerScore == gameDTO.loserScore),
			loserScore: gameDTO.loserScore,
			winnerScore: gameDTO.winnerScore,
			mode: gameDTO.mode,
		});

        //승패를 디비에 갱신.
		if (game.draw == false) {
			++loser.loses;
			++winner.wins;
			this.usersService.save(loser);
			this.usersService.save(winner);
		}
		return this.gameRepo.save(game);
	}

    async getHistoryByUserId(id: number) : Promise<Game[]> {
		return await this.gameRepo.find({
			relations: ['winner', 'loser'],
			where: [
				{ winner: { id: id } },
				{ loser: { id: id } },
			],
		});
	}

    async getAll() : Promise<Game[]> {
		return await this.gameRepo.find();
	}
}

