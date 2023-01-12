import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user); //디비 확인해서 가입된 유저면 토큰 반환.
    }

    @Post('signup')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user); //유저 디비에 저장하고 토큰 반환.
    }

    @Post('test') //auth 테스트용 메소드.
    async test(@Body() user: UserDto) {
        console.log(user);
        return;
    }
}