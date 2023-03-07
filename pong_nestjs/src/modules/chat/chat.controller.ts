import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService,){}

    @Get('rooms')
    getChatRoomList(){
        return Array.from(this.chatService.getRoomList());
        //상태변화 소켓(chatGetRoomList)에서 처럼 넣기, 레디스가 연동되면 빼도 괜찮은 구문으로 보임
    }
}
