import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { JwtService } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports:[
		UsersModule,
		TypeOrmModule.forFeature([Game]),
		CacheModule.register({
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			ttl: 100000, // 없는 경우 default 5초, ttl 단위 초(sec)
		  }),
	],
	providers: [
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		JwtService,
		UsersService,
		GameService,
	],
	controllers: [GameController]
})
export class GameModule {}
