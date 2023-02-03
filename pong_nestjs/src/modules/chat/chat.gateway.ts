// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway(81, { namespace: 'chat' })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   handleConnection() {
//     console.log("접속했습니다.")
//   }

//   handleDisconnect() {
//     console.log("종료했습니다.")
//   }

//   @SubscribeMessage('hihi')
//   connectSomeone(
//     @MessageBody() data: string,
//   ) {
//     const [nickname, room] = data;
//     console.log(`${nickname}님이 코드: ${room}방에 접속했습니다.`);
//     const comeOn = `${nickname}님이 입장했습니다.`;
//     this.server.emit('comeOn' + room, comeOn);
//   }

//   private broadcast(event, client, message: any) {
//     for (let id in this.server.sockets)
//       if (id !== client.id) this.server.sockets[id].emit(event, message);
//   }

//   @SubscribeMessage('send')
//   sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
//     const [room, nickname, message] = data;
//     console.log(`${client.id} : ${data}`);
//     this.broadcast(room, client, [nickname, message]);
//   }
// }

import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { chatClass } from '../../core/chat/chatClass';

@WebSocketGateway({
  cors: { origin: '*' }//, namespace: 'api/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  rooms : chatClass = new chatClass();

  //OnGatewayConnection를 오버라이딩
  async handleConnection(client : Socket) {// 채팅 재 접속시 브라우저 정보를 요청하는 이벤트 요청하기, 채팅방 들어가기 이벤트일때도 똑같이 받는 이벤트 만들기
    this.server.to(client.id).emit('getUser');//해당 클라이언트에게만 보내기
    //console.log('chat', client.id);//client.rooms와 값이 같다
    //console.log(client.rooms);
  }
  
  //OnGatewayDisconnect를 오버라이딩
  async handleDisconnect(client : Socket) {
    this.rooms.delUser(client.id);
    //console.log('delUser', client.id);
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
    this.rooms.newRoom(room, client.id, userId, '');
  }

  @SubscribeMessage('chat')// 테스트용, 음소거, 차단 유무까지 확인을 해야한다.
  async onChat(client : Socket, data) {
    let [room, userid, msg] = data;
    console.log('chat---', client.rooms);  //현재 클라이언트의 방
    console.log(room, userid, msg);//메시지
    if (this.rooms.checkmuteuser(room, client.id))//음소거 상태인지 확인하기
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

  @SubscribeMessage('/api/put/setSecretpw')//비번 변경
  async setSecretpw(client : Socket, data){
    let [room, secretpw, newsecret] = data;
    console.log('/api/put/setSecretpw', client.id, data, room, secretpw, newsecret);
    this.rooms.setSecretpw(room, secretpw, newsecret);
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

  // private broadcast(event, client, message: any) {
  //   for (let id in this.server.sockets)
  //     if (id !== client.id) this.server.sockets[id].emit(event, message);
  // }

  // @SubscribeMessage('send')//채팅방에서 보내는 내용
  //   sendMessage(client : Socket, data) {//추후 방이름, 유저이름, 메세지 보내는 걸로 변경 필요, 클래스 에서 활용홤 
  //   console.log(`${client.id} : ${data}`);
  //   this.server.emit('room', data);// 확인용 나에게 보냄, 방마다 보내는 함수 만들기
  //   //client.broadcast.emit('room', data);  //전체에게 방송함, 나 빼고
  // }

}
