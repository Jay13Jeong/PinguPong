import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' }, namespace: 'api/ping'
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    //OnGatewayConnection를 오버라이딩
    async handleConnection(client : Socket) {// 
      console.log(client.id);//client.rooms와 값이 같다
      console.log(client.rooms);
    }
    
    //OnGatewayDisconnect를 오버라이딩
    async handleDisconnect(client : Socket) {
      console.log('소켓 끊김 : ', client.id);
    }
  
    @SubscribeMessage('requestMatchMake')//
    async requestMatchMake(client : Socket, data) {
       let [difficulty, player] = data;
       console.log('requestMatchMake', client.id, data, difficulty, player);
    
       this.server.emit('matchMakeSuccess', {p1: "매치된 플레이어 1", p2: "매치된 플레이어 2"});
    }

    @SubscribeMessage('requestStart')
    async requestStart(client : Socket, data) {
        this.server.emit('startGame');
        //gameStart();
    }

    @SubscribeMessage('player1Move')
    async player1Move(client : Socket, data) {

    }

    @SubscribeMessage('player2Move')
    async player2Move(client : Socket, data) {

    }

  }
  