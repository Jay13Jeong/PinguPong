import { CacheModule, Module } from '@nestjs/common';
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
import { FriendService } from '../friend/friend.service';
import { Friend } from '../friend/friend.entity';
import { ChatService } from '../chat/chat.service';
import { ChatDmService } from '../chatdm/chatdm.service';
import { Chat } from '../chat/chat.entity';
import { DmList } from '../chatdm/dmList.entity';
import { DmMsgDb } from '../chatdm/dmMsgDb.entity';
import * as redisStore from 'cache-manager-ioredis';

@Module({
	imports:[
		UsersModule,
		GameModule,
		TypeOrmModule.forFeature([Game, Friend, Chat, DmList, DmMsgDb]),
		CacheModule.register({
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			ttl: 100000, // 없는 경우 default 5초, ttl 단위 초(sec)
		  }),
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
		ChatDmService,
  ],
  controllers: [SocketController]
})
export class SocketModule {}
