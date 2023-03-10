import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Users } from '../users/user.entity';

@Module({
  imports:[
		TypeOrmModule.forFeature([Users, Chat]),
	],
  providers: [ChatService,
    JwtService,
    {
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},],
  controllers: [ChatController]
})
export class ChatModule {}
