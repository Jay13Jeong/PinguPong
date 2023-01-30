import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User } from './user.entity';
import { UsersService } from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService,) {}

    //나의 유저 정보를 반환하는 api.
    @Get() 
    @UseGuards(JwtAuthGuard)
    getUserInfo(@Req() req){
        const user = req.user as User;
        return user;
    }

    //선택한 유저 정보를 반환하는 api
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id')id: number){
        const targetUser = await this.usersService.findOne(id);
        return {
            id : targetUser.id,
            username : targetUser.username,
            avatar : targetUser.avatar,
            email : targetUser.email,
            wins : targetUser.wins,
            loses : targetUser.loses,
        }
    }

    //프로필 사진을 업데이트하는 api.
    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body() body){
        let user = req.user as User;
        user.avatar = body.avatar
        return await this.usersService.updateUser(user);
    }

    @Get('all') //테스트용 메소드. 유저 디비조회용.
    findAll(): Promise<User[]>{
        return this.usersService.findAll();
    }
}
