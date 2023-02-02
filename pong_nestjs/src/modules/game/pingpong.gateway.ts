import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { Inject } from '@nestjs/common';


@WebSocketGateway( {
    cors: { origin: '*' }//, namespace: 'api/ping'
  })
  export class pingGateway implements OnGatewayConnection, OnGatewayDisconnect {
     constructor(@Inject(GameService) private readonly gameService:GameService)
     {
     }
    
    @WebSocketServer()
    server: Server;

    //pingpong : GameService = new GameService();

    //OnGatewayConnection를 오버라이딩
    async handleConnection(client : Socket) {
      //console.log('ping', client.id);//client.rooms와 값이 같다
      //console.log(client.rooms);
      //들어온 유저 로그 찍기

    }
    
    //OnGatewayDisconnect를 오버라이딩
    async handleDisconnect(client : Socket) {
      //console.log('ping 소켓 끊김 : ', client.id);
      //게임 중인지 파악하고 패배시키기
      this.gameService.iGamegetout(client);
    }

    //api:유저의 소켓과 난이도에 따른 배열 3개 만들어서 2개 이상이면 매치시켜주기.
    //들어올 때마다 확인하고 if문으로 emit 문자 다르게 보내기
    @SubscribeMessage('requestMatchMake')
    async requestMatchMake(client : Socket, data) {
       let difficulty = data.difficulty;
       let player = data.player;
       console.log('requestMatchMake', client.id, data, difficulty, player);
      // 1. 같은 난이도를 요청한 플레이어가 큐에 있을 경우 게임 매치
      // 2. 같은 난이도를 요청한 플레이어가 큐에 없을 경우 해당 플레이어를 큐에 넣는다.
       if (this.gameService.matchMake(difficulty, player, client.id)){
        this.gameService.matchEmit(this.server, client.id); 
        console.log('matchMake fin');
      }
    }


    @SubscribeMessage('requestStart')
    async requestStart(client : Socket, data) {
      let roomName = data;
      console.log('requestStart11', client.id, data, roomName);
      //플레이어가 준비완료인지 확인하기, 여기서 socket room에 등록을 하자
      if (this.gameService.requestStart(roomName, client, this.server))
        this.gameService.startGame(roomName, this.server);
        //클래스 안에서 소켓메세지 보내기
     
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
      console.log('player1Move', client.id, data, roomName, offset);

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
      console.log('player2Move', client.id, data, roomName, offset);

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
  