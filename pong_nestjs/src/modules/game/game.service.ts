import { BadRequestException, CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { Repository } from 'typeorm';
import { Users } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { GameDto } from './game.dto';
import { Game } from './game.entity';
import { Cache } from 'cache-manager';

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
    private gameFinish:boolean;
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
        server:Server,
        private gameRepo: Repository<Game>,
        private readonly usersService: UsersService,
        ){
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.player1Name = player1;
        this.player2Name = player2;

        this.roomName = player1 + 'vs' + player2;

        this.myserver = server;

        this.watchUser= new Set<Socket>();
        this.player1Ready = false;
        this.player2Ready = false;

        this.goal = 5;
        this.speed = speed;

        this.counter = undefined;
        this.gameFinish = false;
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
        this.myserver= server;
    }

    public async startGame(server:Server): Promise<void>{
        if (this.counter != undefined)//게임 중인지 확인하기
            return ;
        this.myserver = server;
        await this.gameStart();
    }

    /* 공 움직이는 함수 - 반사, 점수 획득 */
    private ballMove():void {
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

    /* 일정 시간마다 게임 동작 함수 실행 */
    private async gameStart ():Promise<void> {
        let me = await this.gameRun.bind(this);
        this.counter = setInterval(me, 1000 * 0.02);
    //api:clearInterval(counter)함수를 쓰면 setInterval를 종료할 수 있다.
    }

    /* 게임 동작 함수 */
    private async gameRun(): Promise<void> {
        // 1. 공 움직이고 (방향전환, 점수 검사)
        this.ballMove();

        // 2. 바뀐 게임 정보들 보내준다. (플레이어와 관전자 모두에게 보내주기)
        this.myserver.to(this.roomName).emit("ballPos", this.game);

        // 3. 공 움직이기 (위치 변화)
        this.game.ball.y += this.game.ball.dy * this.speed;
        this.game.ball.x += this.game.ball.dx * this.speed;
        // 4. 게임 종료 여부도 확인해서 보내주기
        if (this.goal === this.game.score.player1 || this.goal === this.game.score.player2) {
            clearInterval(this.counter); // 반복 종료
            this.gameFinish = true;
            // 이긴 사람만 winner에 넣어서 보내줍니다.
            this.myserver.to(this.roomName).emit("endGame", {winner: this.goal === this.game.score.player1 ? this.player1Name : this.player2Name});
            // TODO - 🌟 전적 정보를 저장해야 한다면 여기서 저장하기 🌟
            this.player1socket.leave(this.roomName);
            this.player2socket.leave(this.roomName);
            for (let socket of this.watchUser.keys())
                socket.leave(this.roomName);
            const winner : Users = await this.usersService.findUserByUsername(this.goal === this.game.score.player1 ? this.player1Name : this.player2Name);
            const loser : Users = await this.usersService.findUserByUsername(this.goal !== this.game.score.player1 ? this.player1Name : this.player2Name);
            const history : GameDto = { //전적 기록.
                winner : winner.id,
                loser : loser.id,
                winnerScore : this.goal === this.game.score.player1 ? this.game.score.player1 : this.game.score.player2,
                loserScore : this.goal !== this.game.score.player1 ? this.game.score.player1 : this.game.score.player2
            };
            this.game.score.player1 = 0;//이긴 사람도 이 부분이 호출 되기 초기화 해주기
            this.game.score.player2 = 0;
            await this.create(history);// 디비에 전적 저장.
        }
    }

    public async iGameLoser(loserName:string):Promise<string>{
        clearInterval(this.counter);
        if (this.gameFinish == true)
            return 'temp';//더미값
        //this.myserver.to(this.player1Id !== loserid ? this.player1Id : this.player2Id).emit("endGame", {winner: this.player1Id !== loserid ? this.player1Name : this.player2Name});
        this.myserver.to(this.player1Id).emit("endGame", {winner: this.player1Name !== loserName ? this.player1Name : this.player2Name});
        this.myserver.to(this.player2Id).emit("endGame", {winner: this.player1Name !== loserName ? this.player1Name : this.player2Name});
        this.myserver.to(this.roomName).emit("endGame", {winner: this.player1Name !== loserName ? this.player1Name : this.player2Name});
        for (let socket of this.watchUser.keys())
                socket.leave(this.roomName);
        if (!((this.game.score.player1 === 0) && (this.game.score.player2 === 0))) {
            const winner : Users = await this.usersService.findUserByUsername(this.player1Name !== loserName ? this.player1Name : this.player2Name);
            const loser : Users = await this.usersService.findUserByUsername(this.player1Name === loserName ? this.player1Name : this.player2Name);
            const history : GameDto = { //전적 기록.
                winner : winner.id,
                loser : loser.id,
                winnerScore : this.player1Name !== loserName ? this.game.score.player1 : this.game.score.player2,
                loserScore : 0
            };
            await this.create(history);// 디비에 전적 저장.
        }
        this.game.score.player1 = 0;//이긴 사람도 이 부분이 호출 되기 초기화 해주기
        this.game.score.player2 = 0;
        return this.player1Name === loserName ? this.player1Id : this.player2Id;
    }

    //사용자가 레디 눌렀는지 확인하기
    public requestStart(socket:Socket, server:Server):boolean {
        if (this.counter != undefined)//게임이 시작중인지 확인하기
            return ;
        if (this.player1Id == socket.id){
            this.player1Ready = true;
            this.player1socket = socket;
            socket.join(this.roomName);
        }
        if (this.player2Id == socket.id){
            this.player2Ready = true;
            this.player2socket = socket;
            socket.join(this.roomName);
        }
        if (this.player1Ready && this.player2Ready){
            server.to(this.roomName).emit('startGame');//여기서 소켓 메시지보내기
            //소켓이 to로 자기자신에게는 메세지를 못 보낸다.
            //2번쨰 누르는 사람은 못 받음,서버가 아닌 소켓이 룸에 보낼때는 브로드캐스팅인것 같다.
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

    public gameFinishCheck():boolean{
        return this.gameFinish;
    }
}

@Injectable()
export class GameService {
    private vs : Map<string, BattleClass>;//roomName:battleClass rooms
    private userIduserName : Map<number, string>;//유저id : 유저name
    private easyLvUserList : Map<number, string>;//유저 id : 소켓 id
    private normalLvUserList : Map<number, string>;
    private hardLvUserList : Map<number, string>;
    private userIdRoomname : Map<number, string>;//userid: roomName
    private NoGamegetoutSocketList: Set<string>;

    public constructor(
        @InjectRepository(Game) private gameRepo: Repository<Game>,
		private usersService: UsersService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.vs = new Map<string, BattleClass>();
        this.userIduserName = new Map<number, string>();
        this.easyLvUserList = new Map<number, string>();
        this.normalLvUserList = new Map<number, string>();
        this.hardLvUserList = new Map<number, string>();
        this.userIdRoomname = new Map<number, string>();
        this.NoGamegetoutSocketList = new Set<string>();
    }

    async test(){
        return await this.usersService.findUserById(1);
    }

    public getRoomList():Array<p1p2>{
        let arr:p1p2[]= [];

        for (let room of Array.from(this.vs.keys()))
            arr.push(this.vs.get(room).getUsers());

        return arr;
    }

    public checkGaming(userId:number):boolean {
        if (this.easyLvUserList.has(userId) === true)
            return true;
        if (this.normalLvUserList.has(userId) === true)
            return true;
        if (this.hardLvUserList.has(userId) === true)
            return true;
        //추가로 this.socketidRoomname.has(socketId)도 확인할 수 있도록 해야 한다.
        if (this.userIdRoomname.has(userId) === true)
            return true;
        return false;
    }

    public addNoGamegetoutSocketList(socketId:string) {
        this.NoGamegetoutSocketList.add(socketId);
    }

    public delNoGamegetoutSocketList(socketId:string) {
        this.NoGamegetoutSocketList.delete(socketId)
    }

    public async iGamegetout(client:Socket) : Promise<void>{
        if (this.NoGamegetoutSocketList.has(client.id) === false)//중복 매칭 된 유저의 소켓id 이면 취소 시킬것
            return ;

        let userId:number = await this.cacheManager.get<number>(client.id);
        if (!this.userIdRoomname.has(userId)) {//대결중이 아니면 종료
            this.userIduserName.delete(userId);
            this.easyLvUserList.delete(userId);//매칭중에 새로고침을 할 경우
            this.normalLvUserList.delete(userId);
            this.hardLvUserList.delete(userId);
            return ;
        }

        //대결 중에 한명이 새로고침을 할경우 , but BattleClass이 이미 지웠지만, 다른 사용자가 새로고침할 경우 문제가 생길 수 있다
        const roomName:string = this.userIdRoomname.get(userId);
        const vs:BattleClass = this.vs.get(roomName);

        if (vs != undefined){//but BattleClass이 이미 지웠지만, 다른 사용자가 새로고침할 경우 문제가 생길 수 있다
            const winner:string = await vs.iGameLoser(this.userIduserName.get(userId));//이긴 사람의 소켓 id
            this.userIdRoomname.delete(await this.cacheManager.get<number>(winner));
        }
        this.userIdRoomname.delete(userId);
        this.userIduserName.delete(userId);
        this.vs.delete(roomName);//방 지우기
        client.leave(roomName);
        this.delNoGamegetoutSocketList(client.id);
    }

    public matchCheck(userId:number):boolean {
        if (this.userIdRoomname.has(userId) === true)
            return true;
        if (this.easyLvUserList.has(userId) === true)
            return true;
        if (this.normalLvUserList.has(userId) === true)
            return true;
        if (this.hardLvUserList.has(userId) === true)
            return true;
        return false;
    }

    //유저를 매칭시키는 함수만들기
        //유저가 플레이어 몇인지 이때 할당하기
    public matchMake(difficulty:number, userName:string, socketid:string, userId:number, server:Server): boolean{
        this.userIduserName.set(userId, userName);
        if (difficulty == 0){
            this.easyLvUserList.set(userId, socketid);
            this.addNoGamegetoutSocketList(socketid);//로비에서 게임에 영향가지 않도록 소켓 저장하기
            return this.createCheck(this.easyLvUserList, socketid, userId, 1, server);
        }
        else if (difficulty == 1){
            this.normalLvUserList.set(userId, socketid);
            this.addNoGamegetoutSocketList(socketid);//로비에서 게임에 영향가지 않도록 소켓 저장하기
            return this.createCheck(this.normalLvUserList, socketid, userId, 1.5, server);
        }
        else if (difficulty == 2){
            this.hardLvUserList.set(userId, socketid);
            this.addNoGamegetoutSocketList(socketid);//로비에서 게임에 영향가지 않도록 소켓 저장하기
            return this.createCheck(this.hardLvUserList, socketid, userId, 2, server);
        }
        return false;
    }

    //소켓id로 관리를 하자.
    private createCheck(UserList:Map<number, string>, player1sockerId:string, player1:number, speed:number, server:Server): boolean{
        let player2:[number, string];
        if (UserList.size >= 2) {//대기열이 2명이상이면 매칭후 방 만들기
            UserList.delete(player1);
            player2 = Array.from(UserList)[0];
            UserList.delete(player2[0]);
            let roomName:string = this.userIduserName.get(player1) + 'vs' + this.userIduserName.get(player2[0]);
            this.vs.set(roomName, new BattleClass(player1sockerId, this.userIduserName.get(player1), player2[1], this.userIduserName.get(player2[0]), speed, server, this.gameRepo, this.usersService));
            this.userIdRoomname.set(player1, roomName);
            this.userIdRoomname.set(player2[0], roomName);
            return true;
        }
        return false;
    }

    public duelRequest(userSocketId:string, user:Users, targetSocketId:string, target:Users, server:Server) {
        let roomName:string = user.username + 'vs' + target.username;
        this.vs.set(roomName, new BattleClass(userSocketId, user.username, targetSocketId, target.username, 1.5, server, this.gameRepo, this.usersService));
        this.userIduserName.set(user.id, user.username);
        this.userIduserName.set(target.id, target.username);
        this.userIdRoomname.set(user.id, roomName);
        this.userIdRoomname.set(target.id, roomName);

        this.addNoGamegetoutSocketList(userSocketId);
        this.addNoGamegetoutSocketList(targetSocketId);
    }

    public duelDelete(userId:number, targetId:number){
        let roomName:string = this.userIdRoomname.get(userId);
        this.userIduserName.delete(userId);
        this.userIduserName.delete(targetId);
        this.userIdRoomname.delete(userId);
        this.userIdRoomname.delete(targetId);
        this.vs.delete(roomName);
    }

    public matchEmit(server:Server, userId:number) {
        const vs:BattleClass = this.vs.get(this.userIdRoomname.get(userId));

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
        if (vs != undefined)//비동기로 인해 게임이 종료되어도 브라우저에서 이벤트를 간혹 보내는 경우 대비
            vs.playerMove(whoplayer, offset);

    }

    public getRoomCheck(roomName:string):boolean {
        if (this.vs.has(roomName) === false)
            return false;
        const vs:BattleClass = this.vs.get(roomName);
        return vs.gameFinishCheck() === false;
    }

    public watchGame(roomName:string, client:Socket) {
        const vs:BattleClass = this.vs.get(roomName);
        if (vs != undefined){
            vs.watchGame(client);
            client.join(roomName);
        }
    }

    public stopwatchGame(roomName:string, client:Socket) {
        const vs:BattleClass = this.vs.get(roomName);
        if (vs != undefined)
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

