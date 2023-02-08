import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketController } from './socket.controller';
import { socketGateway } from './socket.gateway';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GameService } from '../game/game.service';
import { UsersModule } from '../users/users.module';
import { FriendModule } from '../friend/friend.module';
import { FriendService } from '../friend/friend.service';

@Module({
	imports:[UsersModule, FriendModule],
  providers: [SocketService, socketGateway,
  	{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		JwtService,
		UsersService,
		GameService,
		FriendService,],
  controllers: [SocketController]
})
export class SocketModule {}
