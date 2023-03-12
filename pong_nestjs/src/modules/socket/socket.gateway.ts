import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Users } from '../users/user.entity';
import { GameService } from '../game/game.service';
import { FriendService } from '../friend/friend.service';
import { Friend } from '../friend/friend.entity';
import { status } from './userStatusType';
import { ChatService } from '../chat/chat.service';
import { ChatDmService } from '../chatdm/chatdm.service';
import { Cache } from 'cache-manager';

@WebSocketGateway( {
    cors: { origin: '*' }//, credentials: true,}//, namespace: 'api/ping'
  })
  export class socketGateway implements OnGatewayConnection, OnGatewayDisconnect {
     constructor(@Inject(GameService) private readonly gameService:GameService,
     @Inject('AUTH_SERVICE') private readonly authService: AuthService,
		private readonly userService: UsersService,
    private readonly friendService: FriendService,
    private readonly chatService: ChatService,
    private readonly chatDmService: ChatDmService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,)
    {
    }

    @WebSocketServer()
    server: Server;

    //OnGatewayConnection를 오버라이딩
    async handleConnection(client : Socket) {
      const user = await this.findUserBySocket(client);

      if (user != undefined) {//해당 사용자가 디비에 있으면 등록
        await this.setUseridStatus(1, user.id);
        await this.setUseridBySocketid(client.id, user.id);//소켓id와 유저 id 맵핑
        this.chatService.socketSave(user.id, client.id);//소켓통신을 하고 있는 채팅이용자 및 예정자들
      }
    }

    //OnGatewayDisconnect를 오버라이딩
    async handleDisconnect(client : Socket) {
      //게임 중인지 파악하고 패배시키기
      this.gameService.iGamegetout(client);// 핑퐁

      let userId = await this.getUseridBySocketid(client.id);
      if (userId !== null){
        this.chatService.socketDelete(userId, client.id);//소켓통신이 끊긴 채팅이용자 및 예정자들;
        this.setUseridStatus(0, userId);
        this.gameService.delNoGamegetoutSocketList(client.id);//게임중일때 나가면 게임중인 소켓id값에서 지우기
      }
    }

    private async changeUseridStatus(userid:number, status: string) {//유저의 현재 위치를 변경하는 함수
      let userStatus:status = await this.cacheManager.get<status>(String(userid));
      if (userStatus == null)//로그인 전에 호출 되는 경우
        return;
      userStatus.status = status;

      await this.cacheManager.set(String(userid), userStatus);
          //상태는 offline, online, ingame, matching, 채팅이나 디엠 중이면 해당 룸 네임 넣기
    }

    private async setUseridStatus(key:number, userid:number){
      let userStatus:status = await this.cacheManager.get<status>(String(userid));

      if (userStatus === null)
        userStatus = {status:'online', count:0};

      if (key === 1){//카운트 증가,최초 소켓 연결시
          userStatus.count++;//유저가 첫번째 브라우저로 들어옴
      }
      else if (key === 0){//카운트 감소, 소켓 연결 끊길 때
        userStatus.count--;
        if (userStatus.count <= 0)//0보다 작으면 오프라인
          userStatus.status = 'offline';
      }
      await this.cacheManager.set(String(userid), userStatus);
    }

    private async getUseridBySocketid(socketid:string):Promise<number>{
      const userid = await this.cacheManager.get<number>(socketid);
      return userid;
    }

    private async setUseridBySocketid(socketid:string, userid:number){
      await this.cacheManager.set(socketid, userid);
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
  private async findUserBySocket (client: Socket): Promise<Users> {
		const cookies = this.parseCookie(client.handshake.headers.cookie);
		const payload = await this.authService.verifyJWToken(cookies['jwt'])
		if (!payload)
			return null;
		const user = await this.userService.findUserById(payload.sub)
		if (!user)
			return null;
		return user;
	}

  @SubscribeMessage('setInLobby')//사용자가 로비에 들어오면,
  async setInLobby(client : Socket) {
    let userId:number = await this.getUseridBySocketid(client.id);

    await this.changeUseridStatus(userId, 'online');
    //게임 안에 가서 클래스 및 매칭 큐 삭제하기 할 것
    this.gameService.iGamegetout(client);//게임 중에 로비로 올 수 있으니 관련 사항 처리
  }

  @SubscribeMessage('getUserStatus')//api/get/user/status
  async getUserStatus(client : Socket, data) {
    let targetId: number = data;
    let targetStatus:status = await this.cacheManager.get<status>(String(targetId));
    if (targetStatus == null)
      return;
    let status:string = targetStatus.status;

    if (status != 'offline' && status != 'online' && status != 'ingame' && status != 'matching')
      status = 'online';
    this.server.to(client.id).emit('getUserStatus', status, targetId);
    //상태는 offline, online, ingame, matching값 만 반환하기 채팅,디엠방이면 온라인상태이다.
  }

  @SubscribeMessage('chatDelUser')//방에서 나가기 누르면 해당 방에서 유저 삭제/delUser
  async delUser(client : Socket, data) {
    let roomName:string = data;
    let userId:number = await this.getUseridBySocketid(client.id);

    await this.chatService.delUser(roomName, userId, this.server);
  }

  @SubscribeMessage('chatGetUser')//해당 유저 등록하기//getUser
  async getUser(client : Socket, data) {
    let room:string = data.roomName;
    let userId:number = await this.getUseridBySocketid(client.id)
    if (await this.chatService.roomCheck(room) == false) {//없는 방에 입장을 하려고 할때
      this.server.to(client.id).emit('notRoom');
      return ;
    }
    if (await this.chatService.banCheck(room, userId)){//해당 방의 밴 리스트에 있는지 확인
      this.server.to(client.id).emit('youBan');
      return ;
    }
    this.server.to(client.id).emit('youPass');//접속 가능하면
    await this.chatService.newRoom(room, userId);//채팅방에 유저 등록
    await this.changeUseridStatus(userId, room);//유저 상태 변경
    let msgs = await this.chatService.sendMsg(room);
    for (let msg of msgs){//채팅방의 이전 대화 불러오기
    let user:Promise<Users> = this.userService.findUserById(msg.userid);
    this.server.to(client.id).emit('chat', (await user).username, msg.msg);
    console.log("chat", msg.userid, msg.msg);
    }
  }

  @SubscribeMessage('chat')//음소거, 차단 유무까지 확인을 해야한다.
  async onChat(client : Socket, data) {
    let [room, msg] = data;
    let userId:number = await this.getUseridBySocketid(client.id);
    let user:Promise<Users> = this.userService.findUserById(userId);

    if (await this.chatService.checkRoomInUser(userId, room) == false)//유저가 방에 있는 인원인지 확인하기
      return ;
    if (await this.chatService.checkMuteUser(room, userId))//음소거 상태인지 확인하기
      return ;
    //나를 블록한 유저 리스트
    let blockedMe:Friend[] = await this.friendService.getReversBlocks(userId);
    //메세지를 보내야할 소켓id, 나를 차단한 유저를 제외하고.
    const sockets = await this.chatService.getSocketList(room, blockedMe);
    for (let id of sockets){
      this.server.to(id).emit('chat', (await user).username, msg);// 메세지 전송
    }
    await this.chatService.saveMsg(room, userId, msg);
  }

  //방이름 :보내면, 공개방이면 true, 비밀방이면 false 반환
  @SubscribeMessage('chatCheckSecret')///api/check/secret
  async checksecret(client : Socket, data) {
    let roomName:string = data;

    this.server.to(client.id).emit('chatCheckSecret', await this.chatService.checksecret(roomName));
   }

  //방이름, 비밀번호: 받아서 맞으면 true. 틀리면 false// 맞으면 바로 등록해주기
  @SubscribeMessage('chatPostSecretPW')//api/post/secretPW
  async checksecretPw(client : Socket, data) {
    let roomName:string = data.roomName;
    let secretPW:string = data.secret;
    let userId:number = await this.getUseridBySocketid(client.id);

    if (await this.chatService.checksecretPw(roomName, secretPW)){//비밀번호 확인
      await this.chatService.newRoom(roomName, userId);
      this.server.to(client.id).emit('chatPostSecretPW', true);
    }else
    this.server.to(client.id).emit('chatPostSecretPW', false);
  }

  @SubscribeMessage('chatPostNewRoom')//새로운 방 만들기, 이미 있는 방이름이면 false 반환///api/post/newRoom
  async newRoom(client : Socket, data) {
    let [room, secretpw] = data;
    let userId:number = await this.getUseridBySocketid(client.id);

    if (!(await this.chatService.roomCheck(room)) && (room.length <= 10)){//방이름 체크 및 글자수 제한 확인, 한글로 채팅방이름 못 만듬
      await this.chatService.newRoom(room, userId, secretpw);
      this.server.to(client.id).emit('chatPostNewRoom', true);
      await this.changeUseridStatus(userId, room);
    }
    else
      this.server.to(client.id).emit('chatPostNewRoom', false);
  }

  @SubscribeMessage('chatGetMasterStatus')//내가 마스터 이면 true, 아니면 false///api/get/master/status
  async getMasterStatus(client : Socket, data) {
    let roomName:string = data;
    let userid:number = await this.getUseridBySocketid(client.id);

    this.server.to(client.id).emit('chatGetMasterStatus', await this.chatService.getMasterStatus(roomName, userid));// 클래스 함수 리턴값으로 고치기
  }

  @SubscribeMessage('chatGetRoomList')//브라우저가 채팅방 리스트 요청함///api/get/RoomList
  async getChatList(client : Socket) {
    this.server.to(client.id).emit('chatGetRoomList', await this.chatService.getRoomList());// 리스트 보내주기, 클래스 함수 리턴값으로 고치기
    //this.changeUseridStatus(await this.getUseridBySocketid(client.id), 'online');//이 부분 빼도 되지 않나?
  }

  @SubscribeMessage('chatPostMandateMaster')//방장위임 하기///api/post/mandateMaster
  async mandateMaster(client : Socket, data) {
    let [room, targetId] = data;//위임할 targetId

    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.mandateMaster(this.server, room, userId, targetId);
  }

  @SubscribeMessage('chatPutSetSecretpw')//비번 변경, ''이면 공개방으로 전환///api/put/setSecretpw
  async setSecretpw(client : Socket, data){
    let [roomName, newsecret] = data;

    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.setSecretpw(roomName, userId, newsecret);
  }


  @SubscribeMessage('chatPutAddmuteuser')//음소거를 하는 함수///api/put/addmuteuser
  async addmuteuser(client : Socket, data) {
    let [roomName, targetId] = data;//음소거할 타겟id

    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.addmuteuser(roomName, userId, targetId);
  }

  @SubscribeMessage('chatPutFreeMuteUser')//음소거를 해제하는 함수///api/put/freemuteuser
  async freemuteuser(client : Socket, data) {
    let [room, targetId] = data;//음소거 해제할 타겟id

    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.freemuteuser(room, userId, targetId);
  }

  @SubscribeMessage('chatGetMuteUser')//상대가 음소거인지 확인/api/get/muteuser
  async checkMuteYou(client: Socket, data) {
    let [roomName, targetId] = data;//음소거 상태 체크할 타겟id
   this.server.to(client.id).emit('chatGetMuteUser', await this.chatService.checkMuteYou(roomName, targetId));
  }

  @SubscribeMessage('kickUser')//넌 킥
  async kickuser(client: Socket, data) {
    let [roomName, targetId] = data;//킥할 타켓 id
    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.kickUser(this.server, roomName, userId, targetId);
  }

  @SubscribeMessage('banUser')//너 영구밴
  async banUser(client: Socket, data) {
    let [roomName, targetId] = data;
    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatService.banUser(this.server, roomName, userId, targetId);
  }








  @SubscribeMessage('dmList')//디엠 기능 첫 입장, 처음이면 DM 디비 만들기
  async dmList(client:Socket){
    const userId:number = await this.getUseridBySocketid(client.id);

    let userIds:number[] = await this.chatDmService.getdmList(userId);
    let userName:string[] = [];
    for (let id of userIds){
      let name = await (await this.userService.findUserById(id)).username;
      userName.push(name);
    }

    this.server.to(client.id).emit('dmList', userName);//유저 네임 리스트 보내주기
    await this.changeUseridStatus(userId, 'online');//이거 빼도 되지 않은가?
  }

  //메시지를 보냄
  //data = {targetId:11111, msg:'안녕하세요~!'}
  @SubscribeMessage('sendDm')
  async sendDm(client:Socket, data) {
    let targetId:number = data.targetId;
    let msg:string = data.msg;
    let user:Users = await this.findUserBySocket(client);

    let blockedMe:Friend[] = await this.friendService.getReversBlocks(user.id);
    let block:number[] = [];//날 차단한 사람들 id 만 추출
    for (let id of blockedMe)
        block.push(id.sender.id);
    if (!block.includes(targetId))//날 차단 했는지 확인 후 메시지 보내기
      await this.chatDmService.sendDm(this.server, user.id, user.username, targetId, msg);
  }

  //1대1 대화방 입장시 여태까지 받은 Dm 보내주기
  @SubscribeMessage('connectDm')
  async connectDm(client:Socket, data){
    let targetId:number = data;
    let user:Users = await this.findUserBySocket(client);
    await this.chatDmService.connectDm(client, user.id, targetId);
    let target:Users = await this.userService.findUserById(targetId);
    let msgs = await this.chatDmService.getMsgs(user, target);//여태까지 받은 대화들 반환
    this.server.to(client.id).emit('receiveDms', msgs);//반환된 메세지들 보내주기
    //masgs = [{userName : 'tempUser',  msg : '123123123'}, ...]
    await this.changeUseridStatus(user.id, await this.chatDmService.getTargetDmRoom(user.id, targetId));//유저 상태 변경
  }

  //1대1 디엠방 나감
  @SubscribeMessage('closeDm')
  async closeDm(client:Socket, data){
    let targetId:number = data;
    let userId:number = await this.getUseridBySocketid(client.id);
    await this.chatDmService.closeDm(client, userId, targetId);
    await this.changeUseridStatus(userId, 'online');//유저상태 변경
  }









    @SubscribeMessage('pingGetRoomList')//게임 리스트//api/get/roomlist
    async getRoomList(client : Socket) {
      this.server.to(client.id).emit('pingGetRoomList', this.gameService.getRoomList());
    }

    //api:유저의 소켓과 난이도에 따른 배열 3개 만들어서 2개 이상이면 매치시켜주기.
    //들어올 때마다 확인하고 if문으로 emit 문자 다르게 보내기
    @SubscribeMessage('requestMatchMake')
    async requestMatchMake(client : Socket, data) {
       let difficulty:number = data.difficulty;
       let userName:string = data.player;
       let userid:number = await this.getUseridBySocketid(client.id);

      if (this.gameService.matchCheck(userid) === true){//유저가 이미 매칭중인지 확인
         this.server.to(client.id).emit('matchFail');//늦게 매칭한 소켓에게 이벤트 전송
        return ;
      }
      // 1. 같은 난이도를 요청한 플레이어가 큐에 있을 경우 게임 매치
      // 2. 같은 난이도를 요청한 플레이어가 큐에 없을 경우 해당 플레이어를 큐에 넣는다.
       if (this.gameService.matchMake(difficulty, userName, client.id, userid, this.server)){
        this.gameService.matchEmit(this.server, userid);
      }
      await this.changeUseridStatus(userid, 'matching');//유저 상태 변경
    }

    @SubscribeMessage('requestStart')
    async requestStart(client : Socket, data) {
      let roomName = data;

      //플레이어가 준비완료인지 확인하기, 여기서 socket room에 등록을 하자
      if (this.gameService.requestStart(roomName, client, this.server))
        await this.gameService.startGame(roomName, this.server);
      await this.changeUseridStatus(await this.getUseridBySocketid(client.id), 'ingame');
        //클래스 안에서 소켓메세지 보내기
        //api: 각각의 방마다 따로 돌아야 한다.
    }


    /**
     * player1Move - p1이 움직임
     * offset : 움직인 거리
     * 범위를 벗어나지 않는 경우에만 game 변수의 값을 업데이트합니다.
     */
    //api:방이름으로 사용자 찾아서 관리할 것
    @SubscribeMessage('player1Move')
    async player1Move(client : Socket, data) {
      let [offset, roomName] = data;

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

     @SubscribeMessage('gameRoomCheck')//방이 현재 존재 하는지 확인
     async gameRoomCheck(client : Socket, data) {
       let roomName = data;

       this.server.to(client.id).emit('gameRoomCheck',this.gameService.getRoomCheck(roomName));
     }

     @SubscribeMessage('watchGame')//관전하기
     async watchGame(client : Socket, data) {
       let roomName = data;
       this.gameService.watchGame(roomName, client);//이 안에서 소켓룸에 넣어주기
     }

     @SubscribeMessage('stopwatchGame')//관전 그만두기
     async stopwatchGame(client : Socket, data) {
       let roomName = data;
       client.leave(roomName);//먼저 값 못받게 하기
       this.gameService.stopwatchGame(roomName, client);
     }

    /* !SECTION - 게임 관전 */

    /* SECTION - 게임 도전장 */
     //상대방에게 도전장 보내기
     //도전장은 1개만 받을 수 있으며 이미 받았으면 false 보내기, 성공시 true
     //도전장 철회 기능 포함
     @SubscribeMessage('duelRequest')//결투 신청
     async duelRequest(client : Socket, data) {
        let targetId:number = data.targetId;
        let roomName:string = data.roomName;

        let target = await this.userService.findUserById(targetId);
        let user = await this.findUserBySocket(client);

        //_dm으로 오면 룸네임을 찾아서 넣어 줄 것,
        if (roomName === '_dm')
          roomName = await this.chatDmService.getTargetDmRoom(user.id, targetId);

        if (!((await this.cacheManager.get<status>(String(targetId))).status === roomName) || (this.gameService.checkGaming(targetId)))
          return this.server.to(client.id).emit('duelRequest', false);

        let targetSocketIds:Set<string> = this.chatService.getsocketIdByuserId(targetId);
        let targetSocketId:string = Array.from(targetSocketIds)[targetSocketIds.size - 1];//가장 마지막 소켓을 넣어주기
        this.gameService.duelRequest(client.id, user, targetSocketId, target, this.server);//방만들기

        this.server.to(client.id).emit('duelRequest', true);
        this.server.to(targetSocketId).emit('duelAccept', await this.getUseridBySocketid(client.id), user.username);
        await this.changeUseridStatus(user.id, 'matching');
     }

//a가 대기하다 도망가기
     @SubscribeMessage('duelRequestRun')//결투 신청자가 도망간 경우
     async duelRequesRun(client : Socket, data) {
        let targetId:number = data.targetId;

        let targetSocketIds:Set<string> = this.chatService.getsocketIdByuserId(targetId);
        let targetSocketId:string = Array.from(targetSocketIds)[targetSocketIds.size - 1];//가장 마지막 소켓을 넣어주기
        let user = await this.findUserBySocket(client);
        this.gameService.duelDelete(user.id, targetId);//방 폭파하기

        this.server.to(targetSocketId).emit('duelTargetRun', user.username);

     }
          //b가 취소하고 a에게 알려주기
     @SubscribeMessage('duelAccept')//결투 허락
     async duelAccept(client : Socket, data) {
        let targetId:number = data.targetId;//결투를 신청했던 사람
        let result:boolean = data.result;//결투 신청을 받은 사람의 선택

        let targetSocketIds:Set<string> = this.chatService.getsocketIdByuserId(targetId);
        let targetSocketId:string = Array.from(targetSocketIds)[targetSocketIds.size - 1];//가장 마지막 소켓을 넣어주기
        let user = await this.findUserBySocket(client);
        //결투 거절이면 룸 삭제하기
        if (result === false) {
          this.gameService.duelDelete(user.id, targetId);
          this.server.to(targetSocketId).emit('duelTargetRun', user.username);
          return ;
        }
        //대결 상대가 같은 곳에 있는지 확인, 도전장 보낸 사람이 채팅방에서 나간 경우
        if ((await this.cacheManager.get<status>(String(targetId))).status != 'matching'){
          let target:Promise<Users> = this.userService.findUserById(targetId);
          this.gameService.duelDelete(user.id, targetId);
          this.server.to(client.id).emit('duelTargetRun', (await target).username);
          return ;
        }
        //승낙하면 matchMakeSuccess
        this.gameService.matchEmit(this.server, user.id);
        await this.changeUseridStatus(user.id, 'matching');

        //위의 함수에서 'matchMakeSuccess'이벤트 보냄 이후 게임화면 등장
        //->게임준비 버튼 등 로직은   @SubscribeMessage('requestStart')으로 진행된다.
     }

  }
