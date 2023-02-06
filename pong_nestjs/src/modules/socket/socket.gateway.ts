import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { chatClass } from 'src/modules/chat/chatClass';
import { User } from '../users/user.entity';
import { GameService } from '../game/game.service';
import { dmClass } from '../chat/chatDmClass';


@WebSocketGateway( {
    cors: { origin: '*' }//, namespace: 'api/ping'
  })
  export class socketGateway implements OnGatewayConnection, OnGatewayDisconnect {
     constructor(@Inject(GameService) private readonly gameService:GameService,
     @Inject('AUTH_SERVICE') private readonly authService: AuthService,
		private readonly userService: UsersService,)
     {
     }
    
    @WebSocketServer()
    server: Server;

    //pingpong : GameService = new GameService();
    rooms : chatClass = new chatClass();

    //OnGatewayConnection를 오버라이딩
    async handleConnection(client : Socket) {
      console.log('ping', client.id);//client.rooms와 값이 같다
      //console.log(client.rooms);
      //들어온 유저 로그 찍기
      this.server.to(client.id).emit('getUser');//해당 클라이언트에게만 보내기//채팅
      const user = await this.findUserBySocket(client);
    }
    
    //OnGatewayDisconnect를 오버라이딩
    async handleDisconnect(client : Socket) {
      console.log('ping 소켓 끊김 : ', client.id);
      //게임 중인지 파악하고 패배시키기
      this.gameService.iGamegetout(client);// 핑퐁
      this.rooms.delUser(client.id);//채팅
    }


    //비정제 쿠키 데이터를 파싱하는 메소드.
  private parseCookie (cookies: string) {
		const cookieMap = {};
		cookies && cookies.split(';').forEach((cookie) => {
			const parts = cookie.split('=');
			cookieMap[parts.shift().trim()] = decodeURI(parts.join('='));
		});
		return cookieMap;
	}

  //웹소켓의 헤더에서 jwt토큰을 추출하여 해당하는 유저정보를 디비에서 반환하는 메소드.
  private async findUserBySocket (client: Socket): Promise<User> {
		const cookies = this.parseCookie(client.handshake.headers.cookie);
		const payload = await this.authService.verifyJWToken(cookies['jwt'])
		if (!payload)
			return null;
		const user = await this.userService.findUserById(payload.sub)
		if (!user)
			return null;
		return user;
	}
  
  @SubscribeMessage('delUser')//해당 유저 지우기, 방에서 나가기 누를 경우
  async delUser(client : Socket) {
    console.log('delUser', client.id);
    this.rooms.delUser(client.id);
  }

  @SubscribeMessage('getUser')//해당 유저 등록하기
  async getUser(client : Socket, data) {
    let room =data.roomName;
    let userId = data.userId;//비밀번호 안 받음 ''이거로 변경
    console.log('getUser', client.id, data, room, userId, '');
    if (this.rooms.banCheck(room, userId)){
      this.server.to(client.id).emit('youBan');
      return ;
    }
    this.rooms.newRoom(room, client.id, userId, '');
  }

  @SubscribeMessage('chat')// 테스트용, 음소거, 차단 유무까지 확인을 해야한다.
  async onChat(client : Socket, data) {
    let [room, userid, msg] = data;
    console.log('chat---', client.rooms);  //현재 클라이언트의 방
    console.log(room, userid, msg);//메시지
    if (this.rooms.checkMuteUser(client.id))//음소거 상태인지 확인하기
      return ;
    const sockets = this.rooms.getSocketList(room);
    const blockuser = this.rooms.getblockuser(room, client.id);//나중에 디비에서 값 가져오기
    for (let id of sockets) {
      if (blockuser == undefined)//나를 차단한 유저가  없을  경우
        this.server.to(id).emit('chat', userid, msg);
      else if (!blockuser.includes(id))//차단한 유저리스트가 있을 때, 리스트에 없는 사람에게 메세지 보냄
        this.server.to(id).emit('chat', userid, msg);
    }
  } 

  //방이름 :보내면, 공개방이면 true, 비밀방이면 false 반환
  @SubscribeMessage('/api/check/secret')
  async checksecret(client : Socket, data) { 
    let roomName = data;
    console.log('/api/check/secret', client.id, data, roomName);

    this.server.to(client.id).emit('/api/check/secret', this.rooms.checksecret(roomName));
   }

  //방이름, 비밀번호: 받아서 맞으면 true. 틀리면 false// 맞으면 바로 등록해주기
  @SubscribeMessage('/api/post/secretPW')
  async checksecretPw(client : Socket, data) { 
    let roomName = data.roomName;
    let secretPW = data.secret;
    let userId = data.secret;

    console.log('/api/post/secretPW', client.id, data, roomName, secretPW, userId);
    if (this.rooms.checksecretPw(roomName, secretPW)){
      this.rooms.newRoom(roomName, client.id, userId, '');
      this.server.to(client.id).emit('/api/post/secretPW', true);
    }else
    this.server.to(client.id).emit('/api/post/secretPW', false);
  }

  @SubscribeMessage('/api/post/newRoom')//새로운 방 만들기, 이미 있는 방이름이면 false 반환
  async newRoom(client : Socket, data) {
    let [room, userId, secretpw] = data;
    console.log('/api/post/newRoom', client.id, data, room, userId, secretpw);
    if (!this.rooms.roomCheck(room)){
      this.rooms.newRoom(room, client.id, userId, secretpw);
      this.server.to(client.id).emit('/api/post/newRoom', true);
    }
    else
      this.server.to(client.id).emit('/api/post/newRoom', false);
  }

  @SubscribeMessage('/api/get/master/status')//내가 마스터 이면 true, 아니면 false
  async getMasterStatus(client : Socket) { 
    console.log('/api/get/master/status', client.id);

    this.server.to(client.id).emit('/api/get/master/status', this.rooms.getMasterStatus(client.id));// 리스트 보내주기, 클래스 함수 리턴값으로 고치기
  }

  @SubscribeMessage('/api/get/RoomList')//브라우저가 채팅방 리스트 요청함
  async getChatList(client : Socket) { 
    console.log('/api/get/RoomList', client.id, Array.from(this.rooms.getRoomList()));
    this.server.to(client.id).emit('/api/get/RoomList', Array.from(this.rooms.getRoomList()));// 리스트 보내주기, 클래스 함수 리턴값으로 고치기
  }

  @SubscribeMessage('/api/post/mandateMaster')//방장위임
  async mandateMaster(client : Socket, data) {
    let [room, userId] = data;//위임할 userId
    console.log('/api/post/mandateMaster', client.id, data, room, userId);
    this.rooms.mandateMaster(room, client.id, userId);
  }

  @SubscribeMessage('/api/put/setSecretpw')//비번 변경, ''이면 공개방으로 전환
  async setSecretpw(client : Socket, data){
    let newsecret = data;
    console.log('/api/put/setSecretpw', client.id, data, newsecret);
    this.rooms.setSecretpw(client.id, newsecret);
  }

  @SubscribeMessage('/api/put/addblockuser')//차단 유저 추가
  async addblockuser(client : Socket, data) {
    let [room, userId] = data;//차단할 유저 id
    console.log('/api/put/addblockuser', client.id, data, room, userId);
    this.rooms.addblockuser(room, client.id, userId);
  }

  @SubscribeMessage('/api/put/freeblockuser')//차단을 해제하는 함수
  async freeblockuser(client : Socket, data) {
    let [room, userId] = data;//차단을 해제할 유저 id
    console.log('/api/put/freeblockuser', client.id, data, room, userId);
    this.rooms.freeblockuser(room, client.id, userId);
  }

  @SubscribeMessage('/api/put/addmuteuser')//음소거를 하는 함수
  async addmuteuser(client : Socket, data) {
    let [room, userId] = data;//음소거할 유저id
    console.log('/api/put/addmuteuser', client.id, data, room, userId);
    this.rooms.addmuteuser(room, client.id, userId);
  }

  @SubscribeMessage('/api/put/freemuteuser')//음소거를 해제하는 함수
  async freemuteuser(client : Socket, data) {
    let [room, userId] = data;//음소거 해제할 유저id
    console.log('/api/put/freemuteuser', client.id, data, room, userId);
    this.rooms.freemuteuser(room, client.id, userId);
  }

  @SubscribeMessage('api/get/muteuser')//상대가 음소거인지 확인
  async checkMuteYou(client: Socket, data) {
    let targetUser = data;
   this.server.to(client.id).emit('api/get/muteuser', this.rooms.checkMuteYou(client.id, targetUser));
  }

  @SubscribeMessage('kickUser')//넌 킥
  async kickuser(client: Socket, data) {
    let targetUserId = data;
  
    this.rooms.kickUser(this.server, client.id, targetUserId);
  }

  @SubscribeMessage('banUser')//너 영구밴
  async banUser(client: Socket, data) {
    let targetUserId = data;
  
    this.rooms.banUser(this.server, client.id, targetUserId);
  }





  dmRooms : dmClass = new dmClass();

  @SubscribeMessage('dmList')//디엠 기능 첫 입장, 처음이면 DM 디비 만들기
  async dmList(client:Socket){
    const user = await this.findUserBySocket(client);
    
    this.dmRooms.setUsers(client.id, user.id);
    let userIds:number[] = this.dmRooms.getdmList(client.id);
    let userName:string[];
    for (let id of userIds){
      let name = await (await this.userService.findUserById(id)).username;
      userName.push(name);
    }
    this.server.to(client.id).emit('dmList', userName);//유저 네임 리스트 보내주기
  }

  //메시지를 보냄
  //data = {targetId:11111, msg:'안녕하세요~!'}
  @SubscribeMessage('sendDm')
  async sendDm(client:Socket, data){
    let targetId = data.targetId;
    let msg = data.msg;
    //dm msg 저장 하는 곳 만들 것
    this.server.to(client.id).emit('receiveDm', msg);
    //단일 메세지 보냄
  }

  //1대1 대화방 입장시 여태까지 받은 Dm 보내주기
  @SubscribeMessage('connectDm')
  async connectDm(client:Socket, data){//userId
    let targetId = data;
    this.server.to(client.id).emit('receiveDms', 'msgs');
    //msgs = {{user:'lee',msg:'qwe'},{user:'lee',msg:'123'}, ...}
  }

  //1대1 디엠방 나감
  @SubscribeMessage('closeDm')
  async closeDm(client:Socket, data){
    let targetId = data;
    this.dmRooms.closeDm(client, targetId);
  }



























    @SubscribeMessage('api/get/roomlist')//게임 리스트
    async getRoomList(client : Socket) {
      this.server.to(client.id).emit('api/get/roomlist', this.gameService.getRoomList());
    }

    //api:유저의 소켓과 난이도에 따른 배열 3개 만들어서 2개 이상이면 매치시켜주기.
    //들어올 때마다 확인하고 if문으로 emit 문자 다르게 보내기
    @SubscribeMessage('requestMatchMake')
    async requestMatchMake(client : Socket, data) {
       let difficulty = data.difficulty;
       let player = data.player;
       //console.log('requestMatchMake', client.id, data, difficulty, player);
       //console.log('requestMatchMake', client.id, client.rooms);
      // 1. 같은 난이도를 요청한 플레이어가 큐에 있을 경우 게임 매치
      // 2. 같은 난이도를 요청한 플레이어가 큐에 없을 경우 해당 플레이어를 큐에 넣는다.
       if (this.gameService.matchMake(difficulty, player, client.id)){
        this.gameService.matchEmit(this.server, client.id); 
        console.log('matchMake fin');
      }
    }

    @SubscribeMessage('watchGame')//관전하기
    async watchGame(client : Socket, data) {
      let roomName = data;
      client.join(roomName);
      this.gameService.watchGame(roomName, client);
    }

    @SubscribeMessage('stopwatchGame')//관전 그만두기
    async stopwatchGame(client : Socket, data) {
      let roomName = data;
      client.leave(roomName);
      this.gameService.stopwatchGame(roomName, client);
    }

    @SubscribeMessage('requestStart')
    async requestStart(client : Socket, data) {
      let roomName = data;
      
      //플레이어가 준비완료인지 확인하기, 여기서 socket room에 등록을 하자
      if (this.gameService.requestStart(roomName, client, this.server))
        this.gameService.startGame(roomName, this.server);
        //클래스 안에서 소켓메세지 보내기
        //console.log('requestStart11', client.id, client.rooms);
        //this.server.emit('startGame');//api: 시작 신호 보내기. 서버에서 쓰레드 돌리기 시작, if문으로 구별해서 보내기
        //gameStart();//게임 실행 함수 호출
        //api: 각각의 방마다 따로 돌아야 한다.이부분을 공부해 보자,, 모듈을 만들어야 한다.
        //api : 스레드가 안되면 브라우저에서 요청이 계속 오도록 해서 답변하는 식으로 하자.
    }


    //public putBallPos(socket:string, data){
    //  this.server.to(socket).emit("ballPos", data);
    //}
    /**
     * player1Move - p1이 움직임
     * offset : 움직인 거리
     * 범위를 벗어나지 않는 경우에만 game 변수의 값을 업데이트합니다.
     */
    //api:방이름으로 사용자 찾아서 관리할 것
    @SubscribeMessage('player1Move')
    async player1Move(client : Socket, data) {
      let [offset, roomName] = data;
      //console.log('player1Move', client.id, data, roomName, offset);

      this.gameService.playerMove('1', roomName, offset);
    }

    /**
     * player1Move - p2가 움직임
     * offset : 움직인 거리
     * 범위를 벗어나지 않는 경우에만 game 변수의 값을 업데이트합니다.
     */
    @SubscribeMessage('player2Move')
    async player2Move(client : Socket, data) {
      let [offset, roomName] = data;
      //console.log('player2Move', client.id, data, roomName, offset);

      this.gameService.playerMove('2', roomName, offset);
    }

    /**
     * TODO - p1/p2 중 하나라도 연결이 끊겼을 때 게임을 종료시켜야 합니다.
     * 따로 이벤트로 구분해주셔도 되고, endGame으로 한번에 처리해주셔도 됩니다.
     */

    /* !SECTION - 게임 플레이 */

    /* SECTION - 게임 관전 */
    
    /**
     * TODO - 참여할 수 있는 게임의 목록을 보내야 합니다.
     * - (필요한 정보: (필수)player1 ID, (필수)player2 ID, score?, 난이도?)
     */

    /**
     * TODO - 현재 진행중인 게임에 접속할 수 있어야 합니다.
     */

    /* !SECTION - 게임 관전 */

    /* SECTION - 게임 도전장 */

    /**
     * TODO - 방법 논의 필요....
     */

    /* !SECTION - 게임 도전장 */

  }
  