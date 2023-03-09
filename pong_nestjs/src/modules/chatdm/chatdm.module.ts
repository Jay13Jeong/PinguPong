import { Module } from '@nestjs/common';
import { ChatDmService } from './chatdm.service';
import { ChatDmController } from './chatdm.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/user.entity';
import { DmList } from './dmList.entity';
import { DmMsgDb } from './dmMsgDb.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Users, DmList, DmMsgDb]),
	],
  providers: [ChatDmService,
    UsersService,
    JwtService,
    {
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
  ],
  controllers: [ChatDmController]
})
export class ChatdmModule {}
