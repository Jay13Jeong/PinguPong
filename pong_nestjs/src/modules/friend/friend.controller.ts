import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { Users } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
    constructor(
        private readonly friendServices : FriendService,
        private readonly authServices : AuthService,
        private readonly userServices : UsersService,
    ){ };

    // @Get('test') //테스트용 친구들
    // @UseGuards(JwtAuthGuard)
    // async inputDummyFriendList(@Req() req)
	// {
    //     const user = req.user as Users;
    //     const user2 = await this.authServices.validateUser({
    //         username: 'pinga7', //ex. jjeong
	// 		email: 'pinga7@pong.com',
	// 		oauthID: '99987', //ex. 85322
    //     })
    //     const user3 = await this.authServices.validateUser({
    //         username: 'pinga8', //ex. jjeong
	// 		email: 'pinga8@pong.com',
	// 		oauthID: '99988', //ex. 85322
    //     })
    //     const user4 = await this.authServices.validateUser({
    //         username: 'pinga9', //ex. jjeong
	// 		email: 'pinga9@pong.com',
	// 		oauthID: '99989', //ex. 85322
    //     })
    //     const user5 = await this.authServices.validateUser({
    //         username: 'pinga5', //ex. jjeong
	// 		email: 'pinga5@pong.com',
	// 		oauthID: '99985', //ex. 85322
    //     })
    //     await this.friendServices.invite(user, 2);
    //     await this.friendServices.invite(user, 3);
    //     // await this.friendServices.invite(user, 4);
    //     await this.friendServices.invite(user, 5); //친추 수락 대기중.
    //     await this.friendServices.invite(user2, 1); //친구됨
    //     await this.friendServices.invite(user3, 1); //친구됨
    //     await this.friendServices.invite(user4, 1); //상대가 나에게 친추 검.
    //     await this.friendServices.block(user, 4);
    //     await this.friendServices.block(user4, 1);
	// }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getFriendList(@Req() req){
        const user = req.user as Users;
		return await this.friendServices.getFriends(user.id);
	}

    @Get('pendings')
    @UseGuards(JwtAuthGuard)
    async getPendingList(@Req() req){
        const user = req.user as Users;
		return await this.friendServices.getPendings(user.id);
	}

    @Get('block')
    @UseGuards(JwtAuthGuard)
    async getBlockList(@Req() req){
        const user = req.user as Users;
		return await this.friendServices.getBlocks(user.id);
	}

    @Get('relate/:targetID')
    @UseGuards(JwtAuthGuard)
    async getRelate(@Req() req, @Param('targetID', ParseIntPipe) targetID: number) {
        const user = req.user as Users;
		return await this.friendServices.getRelate(user.id, targetID);
	}

    //이름으로 친구초대 또는 수락하는 api.
    @Post('name')
    @UseGuards(JwtAuthGuard)
    async inviteFriendByName(@Req() req, @Body('username') username: string){
        //문자열에 공백이 있는 경우
        let blank_pattern = /[\s]/g;
        if( blank_pattern.test(username) == true){
            throw new BadRequestException('공백이 입력되었습니다');
        }
        //특수문자가 있는 경우
        let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
        if(special_pattern.test(username) == true){
            throw new BadRequestException('특수문자가 입력되었습니다');
        }
        //공백 혹은 특수문자가 있는 경우
        if(username.search(/\W|\s/g) > -1){
            throw new BadRequestException('특수문자 또는 공백이 입력되었습니다');
        }
        let user = req.user as Users;
        const target = await this.userServices.findUserByUsername(username);
        if (!target)
            throw new BadRequestException('해당 유저 없음.');
        const raw = await this.friendServices.invite(user, target.id);
        return raw;
    };

    //친구초대 또는 수락하는 api.
    @Post()
    @UseGuards(JwtAuthGuard)
    async inviteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as Users;
        const raw = await this.friendServices.invite(user, otherID);
        return raw;
    };

    //친구 해제
    @Patch()
    @UseGuards(JwtAuthGuard)
    async deleteFriend(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as Users;
        const raw = await this.friendServices.delete(user, otherID);
        return raw;
        //친구 끊기.
    }

    //친구 블락
    @Post('block')
    @UseGuards(JwtAuthGuard)
    async block(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as Users;
        //친구를 차단한다.
        const raw = await this.friendServices.block(user, otherID);
        return raw;
    };

    //친구 블락해제
    @Patch('block')
    @UseGuards(JwtAuthGuard)
    async unblock(@Req() req, @Body('otherID', ParseIntPipe) otherID: number){
        let user = req.user as Users;
        //친구 차단 해제.
        const raw = await this.friendServices.unblock(user.id, otherID);
        return raw;
    }
}
