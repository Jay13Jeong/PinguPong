import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
		TypeOrmModule.forFeature([Chat]),
	],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
