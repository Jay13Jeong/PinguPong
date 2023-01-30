import { Body, Controller, Delete, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User } from '../users/user.entity';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
    constructor(
        private readonly friendServices : FriendService
    ){ };

    //친구초대 또는 수락하는 api.
    @Post()
    @UseGuards(JwtAuthGuard)
    async inviteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        const raw = await this.friendServices.invite(user, otherID);
        return raw;
    };

    //친구 해제
    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        //친구 끊기.
    }

    //친구 블락
    @Post('block')
    @UseGuards(JwtAuthGuard)
    async block(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        //친구를 차단한다.
    };

    //친구 블락해제
    @Delete('block')
    @UseGuards(JwtAuthGuard)
    async unblock(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        //친구 차단 해제.
    }
}
