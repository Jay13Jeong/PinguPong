import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
    constructor(
        private readonly friendServices : FriendService,
        private readonly authServices : AuthService,
    ){ };

    @Get('test') //테스트용 친구들
    @UseGuards(JwtAuthGuard)
    async inputDummyFriendList(@Req() req)
	{
        const user = req.user as User;
        const user2 = await this.authServices.validateUser({
            username: 'pinga7', //ex. jjeong
			email: 'pinga7@pong.com',
			oauthID: '99987', //ex. 85322
        })
        const user3 = await this.authServices.validateUser({
            username: 'pinga8', //ex. jjeong
			email: 'pinga8@pong.com',
			oauthID: '99988', //ex. 85322
        })
        const user4 = await this.authServices.validateUser({
            username: 'pinga9', //ex. jjeong
			email: 'pinga9@pong.com',
			oauthID: '99989', //ex. 85322
        })
        const user5 = await this.authServices.validateUser({
            username: 'pinga5', //ex. jjeong
			email: 'pinga5@pong.com',
			oauthID: '99985', //ex. 85322
        })
        await this.friendServices.invite(user, 2);
        await this.friendServices.invite(user, 3);
        // await this.friendServices.invite(user, 4);
        await this.friendServices.invite(user, 5); //친추 수락 대기중.
        await this.friendServices.invite(user2, 1); //친구됨
        await this.friendServices.invite(user3, 1); //친구됨
        await this.friendServices.invite(user4, 1); //상대가 나에게 친추 검.
	}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getFriendList(@Req() req)
	{
        const user = req.user as User;
        // console.log("322?");
		return await this.friendServices.getFriends(user.id);
	}

    //친구초대 또는 수락하는 api.
    @Post()
    @UseGuards(JwtAuthGuard)
    async inviteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        const raw = await this.friendServices.invite(user, otherID);
        return raw;
    };

    //친구 해제
    @Patch()
    @UseGuards(JwtAuthGuard)
    async deleteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        const raw = await this.friendServices.delete(user, otherID);
        return raw;
        //친구 끊기.
    }

    //친구 블락
    @Post('block')
    @UseGuards(JwtAuthGuard)
    async block(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        //친구를 차단한다.
        const raw = await this.friendServices.block(user, otherID);
        return raw;
    };

    //친구 블락해제
    @Patch('block')
    @UseGuards(JwtAuthGuard)
    async unblock(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as User;
        //친구 차단 해제.
        const raw = await this.friendServices.unblock(user.id, otherID);
        return raw;
    }
}
