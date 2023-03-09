import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService,){}

    @Get('rooms')
    @UseGuards(JwtAuthGuard)
    async getChatRoomList(){
        return await this.chatService.getRoomList();
        //상태변화 소켓(chatGetRoomList)에서 처럼 넣기, 레디스가 연동되면 빼도 괜찮은 구문으로 보임
    }
}
