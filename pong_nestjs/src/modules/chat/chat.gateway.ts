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

@WebSocketGateway( {
  cors: { origin: '*' }, namespace: 'api/chat'
})
export class ChatGateway {//implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: number = 0;

  //OnGatewayConnection를 오버라이딩
  async handleConnection() {
    this.users++;  //사용자 증가
    this.server.emit('users', this.users);
    console.log(this.users);
  }
  
  //OnGatewayDisconnect를 오버라이딩
  async handleDisconnect() {
    this.users--;  //사용자 감소
    this.server.emit('users', this.users);
    console.log(this.users);
  }

  @SubscribeMessage('chat')
  async onChat(client : Socket, message) { 
    console.log(client.rooms)  //현재 클라이언트의 방
    console.log(message)    //메시지
    client.broadcast.emit('chat', message);  //전체에게 방송함
  }
}
