import { Body, Controller, Get, Inject, Patch, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';
import { Jwt2faGuard, JwtAuthGuard } from '../guard/jwt.guard';
import { SecondAuthService } from './second-auth.service';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Controller('fa2')
export class SecondAuthController {
    constructor(
        private readonly secondAuthServices : SecondAuthService,
        private readonly jwtServices : JwtService,
        @InjectRepository(User) public userRepository: Repository<User>,
    ){}

    //jwt토큰 속 이메일로 인증코드 메시지를 전송하는 메소드.
    //동시에 디비에 메일로 보낸 2fa인증코드를 업데이트한다.
    @Get()
    @UseGuards(JwtAuthGuard)
    callMail(@Req() req: Request){
        let user = req.user as User;
        const email : string = user.email;
        const code2fa : string = "5432"; //랜덤한 값(string)을 주도록 바꿔야함.
        // this.secondAuthServices.sendCode('42.4.jjeong@gmail.com', code2fa);
        this.secondAuthServices.sendCode(email, code2fa);
        user.twofa_secret = code2fa;
        this.userRepository.save(user);
        // console.log('callMail with code...');
    }

    //2단계 인증이 켜져있는지 확인하는 메소드.√
    @Get('status')
    @UseGuards(JwtAuthGuard)
    is2faOn(@Req() req: Request){
        //시나리오 : 2fa페이지 접속시 먼저 이 api로 상태를 검사한다.
        const user = req.user as User;
        return { msg : (user.twofa? 'ON' : 'OFF') };
    }

    //2단계 인증을 활성화하는 메소드.
    @Patch()
    @UseGuards(JwtAuthGuard)
    activate(@Req() req: Request, @Body() body){
        let user = req.user as User;
        user.twofa = true;
        this.userRepository.save(user);
        return 'ON';
    }

    //2단계 인증을 비활성화하는 메소드.
    @Patch()
    @UseGuards(JwtAuthGuard)
    deactivate(@Req() req: Request, @Body() body){
        let user = req.user as User;
        user.twofa = false;
        this.userRepository.save(user);
        return 'OFF';
    }

    //디비의 2단계코드와 클라이언트에서 입력한 파라메터가 동일한지 비교하는 메소드.
    @Post()
    @UseGuards(Jwt2faGuard)
    confirm(@Req() req: Request, @Res() res, @Body() body){
        //디비에 있는 인증코드와 인풋 파라메터 값을 비교한다.
        const user = req.user as User;
        const fa2Code = body.code;
        if (fa2Code !== user.twofa_secret)
            throw new UnauthorizedException('2단계 코드 불일치.');
        res.clearCookie('jwt');
        const newToken = this.jwtServices.sign({ sub: user.id, oauthID: user.oauthID, twofa_verified: true }, { secret: process.env.JWTKEY });
        res.cookie('jwt', newToken);
		res.status(200).send();
    }
}
