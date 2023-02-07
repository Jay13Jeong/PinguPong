import { BadRequestException, Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User } from './user.entity';
import { UsersService } from "./users.service";
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService,) {}

    @Get('test') //테스트용 메소드. 유저 디비조회용.
    async findA(): Promise<User[]>{
        return await this.usersService.findAll();
    }

    @Get('name') //이름으로 조회.
    @UseGuards(JwtAuthGuard)
    async findName(@Query('username') username: string){
        const targetUser = await this.usersService.findUserByUsername(username);
        if (!targetUser)
            throw new BadRequestException('해당 유저 없음.');
        return {
            id : targetUser.id,
            username : targetUser.username,
            avatar : targetUser.avatar,
            email : targetUser.email,
            wins : targetUser.wins,
            loses : targetUser.loses,
        }
    }

    //초기화가 되어 있는지 상태를 반환하는 api.
    @Get('init/status')
    @UseGuards(JwtAuthGuard)
    getUserInit(@Req() req : Request){
        const user = req.user as User;
        if (!user)
            return {msg : false};
        // console.log("123");
        if (user.username.slice(0,8) !== 'no_init_')
            return {msg : true}
            // console.log("234");
        return {msg : false};
    }

    //나의 유저 정보를 반환하는 api.
    @Get() 
    @UseGuards(JwtAuthGuard)
    getUserInfo(@Req() req : Request){
        const user = req.user as User;
        // console.log(user);
        return user;
    }

    //선택한 유저의 아바타를 가져오는 api.
	@Get('avatar/:id')
	@UseGuards(JwtAuthGuard)
	async getUserAvatar(@Param('id', ParseIntPipe) id: number, @Res() res){
		return await this.usersService.getAvatar(id, res);
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

    //프로필을 업데이트하는 api.
    @Patch()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req : Request, @Body() body){
        let user = req.user as User;
        if (!user || body.username === '')
            throw new BadRequestException('잘못된 유저 요청.');
        // user.avatar = body.avatar;
        user.username = body.username;
        return await this.usersService.updateUser(user);
    }

    @Post('avatar') //아바타 이미지 업로드 api.
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async setUserAvatar(
        @Req() req : Request,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: ( 1 << 20 ) * 4 }), //사진최대 크기 4mb.
				]
			})
		)
		file: Express.Multer.File
	){
        const user = req.user as User;
		return this.usersService.postAvatar(user, file.filename);
	}
}
