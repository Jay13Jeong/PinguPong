import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[
		UsersModule,
		TypeOrmModule.forFeature([Game]),
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
