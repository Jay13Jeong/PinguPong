import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { pingGateway } from './pingpong.gateway';


@Module({
  imports: [],
  controllers: [GameController],
  providers: [ GameService, pingGateway]
})
export class GameModule {}
