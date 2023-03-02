import { Module } from '@nestjs/common';
import { ChatDmService } from './chatdm.service';
import { ChatDmController } from './chatdm.controller';

@Module({
  providers: [ChatDmService],
  controllers: [ChatDmController]
})
export class ChatdmModule {}
