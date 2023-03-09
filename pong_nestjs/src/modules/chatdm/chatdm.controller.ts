import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { Users } from '../users/user.entity';
import { ChatDmService } from './chatdm.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('chatdm')
export class ChatDmController {
    constructor(private readonly chatDmService: ChatDmService,
        private readonly userService: UsersService,){}

    @Get('rooms')//테스트 할 것
    @UseGuards(JwtAuthGuard)
    async getChatDmRoomList(@Req() req : Request){
        const user = req.user as Users;

        let userIds:number[] = await this.chatDmService.getdmList(user.id);
        let userName:string[] = [];
        for (let id of userIds){
            let name = await (await this.userService.findUserById(id)).username;
            userName.push(name);
        }
        return userName;
    }

}
