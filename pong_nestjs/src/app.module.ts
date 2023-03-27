import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './modules/users/user.entity';
import { Friend } from './modules/friend/friend.entity';
import { FriendModule } from './modules/friend/friend.module';
import { Game } from './modules/game/game.entity';
import { Chat} from './modules/chat/chat.entity';
import { SocketModule } from './modules/socket/socket.module';
import { Ban } from './modules/chat/ban.entity';
import { Mute } from './modules/chat/mute.entity';
import { RoomUserId } from './modules/chat/room.entity';
import { ChatModule } from './modules/chat/chat.module';
import { ChatdmModule } from './modules/chatdm/chatdm.module';
import { DmList } from './modules/chatdm/dmList.entity';
import { DmMsgDb } from './modules/chatdm/dmMsgDb.entity';
import { Msgs } from './modules/chat/msg.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres', // 디비 종류.
      host: process.env.DB_HOST, // 디비호스트.
      port: +process.env.DB_PORT, // 디비포트.
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_DEVELOPMENT,
      autoLoadEntities: true, // 엔티티를 자동으로 로드.
      synchronize: true, // 앱을 실행할 때마다 운영 주체가 데이터베이스와 동기화. 개발모드에서만 써야함.
      entities: [Users, Friend, Game, Chat, Ban, Mute, RoomUserId, DmList, DmMsgDb, Msgs] //디비가 다룰 엔티티목록.
    }),
    UsersModule,
    AuthModule,
    FriendModule,
    SocketModule,
    ChatModule,
    ChatdmModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
