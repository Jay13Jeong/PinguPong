import { Controller, Body, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local')) //local.strategy.ts을 사용하도록 정의.
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user); //디비 확인해서 가입된 유저면 토큰 반환.
    }

    @UseGuards(DoesUserExist) //중복 가입 방어 가드.
    @Post('signup')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user); //유저 디비에 저장하고 토큰 반환.
    }

    @Post('test') //auth 테스트용 api.
    async test(@Body() user: UserDto, @Res({ passthrough: true }) res: Response,) {
        // res.cookie('Authentication', access_token, {
        //     domain: 'localhost',
        //     path: '/',
        //     httpOnly: true,
        //   });
        //   return access_token;
        return;
    }
}