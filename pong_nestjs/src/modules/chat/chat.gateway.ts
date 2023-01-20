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
  cors: { origin: '*' }, namespace: 'api/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: number = 0;

  rooms : chatClass;

  //OnGatewayConnection를 오버라이딩
  async handleConnection(client : Socket) {// 채팅 재 접속시 브라우저 정보를 요청하는 이벤트 요청하기, 채팅방 들어가기 이벤트일때도 똑같이 받는 이벤트 만들기
    this.users++;  //사용자 증가
    this.server.emit('users', this.users);
    console.log(this.users);
    console.log(client.id);//client.rooms와 값이 같다
    console.log(client.rooms);
  }
  
  //OnGatewayDisconnect를 오버라이딩
  async handleDisconnect() {
    this.users--;  //사용자 감소
    this.server.emit('users', this.users);
    console.log(this.users);
  }

  @SubscribeMessage('getchatlist')//브라우저가 채팅방 리스트 요청함
  async getChatList(client : Socket, data) { 
    console.log('채팅방 목록 요청', client.id, data);
    this.server.emit('chatlist', 'lists');// 리스므 보내주기, 클래스 함수 리턴값으로 고치기
  }

  @SubscribeMessage('chat')// 테스트용
  async onChat(client : Socket, message) { 
    console.log(client.rooms)  //현재 클라이언트의 방
    console.log(message)    //메시지
    client.broadcast.emit('chat', message);  //전체에게 방송함, 나 빼고
  }

  // private broadcast(event, client, message: any) {
  //   for (let id in this.server.sockets)
  //     if (id !== client.id) this.server.sockets[id].emit(event, message);
  // }

  @SubscribeMessage('send')//채팅방에서 보내는 내용
    sendMessage(client : Socket, data) {//추후 방이름, 유저이름, 메세지 보내는 걸로 변경 필요, 클래스 에서 활용홤 
    console.log(`${client.id} : ${data}`);
    this.server.emit('room', data);// 확인용 나에게 보냄, 방마다 보내는 함수 만들기
    //client.broadcast.emit('room', data);  //전체에게 방송함, 나 빼고
  }



}
