import { Controller, Body, Post, UseGuards, Request, Res, UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { authCodesDto } from './dto/authCodes.dto';
import { AuthUserDto } from './dto/authUser.dto';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    private usersMap = new Map(); //{키 : 42권한코드, 값 : 유저 엔티티}

    // 파라메터로 42권한코드, 2차인증코드를 받아 42베어러 엑세스 토큰을 얻고, 유저정보가 없다면 디비에 생성하고
    @Post('/access_token')
    async authenticate(@Query() authCodes: authCodesDto, @Res() response: Response) {
      const { code, twoFactorAuth } = authCodes; //클라이언트 요청의 파라메터에서 42권한코드와 2차인증 코드를 받는다.
      let userExist;
      if (!this.usersMap.has(code)) {
        const newUser: AuthUserDto = await this.authService.getUserData(code);
        if (!newUser) throw new BadRequestException('42api 인증(로그인)을 통한 유저정보 조회 실패'); //42api 400 에러 처리.
        userExist = await this.usersService.findByEmail({ email: newUser.email }); //이메일 중복 검사.
        if (!userExist) { //첫 접속 유저면 디비에 유저 정보를 저장한다.
          userExist = await this.usersService.createUser(newUser); 
          return await this.authService.sendJwtWithUserInfo(response, userExist, false, true); //엑세스 토큰을 반환하며 바로 종료.
        }
  
        if (userExist && userExist.is2FAEnabled && !this.usersMap.has(code)) {
          this.usersMap.set(code, userExist);
  
          throw new UnauthorizedException({ "is2FA": true });
        }
      }
  
  
      if (this.usersMap.has(code)) {
        userExist = this.usersMap.get(code);
        const isValid2FACode = this.authService.checkEmail2FA(
          twoFactorAuth,
          userExist.twoFASecret,
        );
        if (!isValid2FACode) throw new UnauthorizedException('2차인증 실패');
        this.usersMap.delete(code);
      }
      await this.authService.sendJwtWithUserInfo(response, userExist, true, false);
    }

    // jwt test codes ///////////
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