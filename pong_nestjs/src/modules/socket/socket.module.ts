import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketController } from './socket.controller';
import { socketGateway } from './socket.gateway';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GameService } from '../game/game.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/game.entity';
import { GameModule } from '../game/game.module';
import { FriendModule } from '../friend/friend.module';
import { FriendService } from '../friend/friend.service';
import { Friend } from '../friend/friend.entity';
import { ChatService } from '../chat/chat.service';

@Module({
	imports:[
		UsersModule,
		GameModule,
		TypeOrmModule.forFeature([Game, Friend]),
	],
	providers: [
		SocketService,
		socketGateway,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		JwtService,
		UsersService,
		GameService,
		FriendService,
		ChatService,
  ],
  controllers: [SocketController]
})
export class SocketModule {}
