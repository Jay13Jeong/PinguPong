import { Body, Controller, Delete, Get, NotFoundException, Patch, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Users } from 'src/modules/users/user.entity';
import { Jwt2faGuard, JwtAuthGuard } from '../guard/jwt.guard';
import { SecondAuthService } from './second-auth.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('fa2')
export class SecondAuthController {
    constructor(
        private readonly secondAuthServices : SecondAuthService,
        private readonly jwtServices : JwtService,
        @InjectRepository(Users) public userRepository: Repository<Users>,
    ){}

    //jwt토큰 속 이메일로 인증코드 메시지를 전송하는 메소드.
    //동시에 디비에 메일로 보낸 2fa인증코드를 업데이트한다.
    @Get()
    @UseGuards(Jwt2faGuard)
    async callMail(@Req() req: Request){
        let user = req.user as Users;
        const email : string = user.email;
        const code2fa : string = Math.random().toString(36).slice(2,6); //랜덤한 값을 ^10
        this.secondAuthServices.sendCode(email, code2fa);
        user.twofa_secret = await bcrypt.hash(code2fa, 10);
        this.userRepository.save(user);
    }

    //2단계 인증이 켜져있는지 확인하는 메소드.√
    @Get('status')
    @UseGuards(Jwt2faGuard)
    is2faOn(@Req() req: Request){
        //시나리오 : 2fa페이지 접속시 먼저 이 api로 상태를 검사한다.
        const user = req.user as Users;
        return { twofa : user.twofa };
    }

    //2단계 인증을 활성화하는 메소드.
    @Patch()
    @UseGuards(JwtAuthGuard)
    activate(@Req() req: Request){
        if (process.env.USER_2FA === "" || process.env.PASS_2FA === ""){
            throw new NotFoundException('서버 환경변수에 2단계 인증 설정없음.');
        }
        let user = req.user as Users;
        user.twofa = true;
        this.userRepository.save(user);
        return 'ON';
    }

    //2단계 인증을 비활성화하는 메소드.
    @Delete()
    @UseGuards(JwtAuthGuard)
    deactivate(@Req() req: Request){
        let user = req.user as Users;
        user.twofa = false;
        this.userRepository.save(user);
        return 'OFF';
    }

    //디비의 2단계코드와 클라이언트에서 입력한 파라메터가 동일한지 비교하는 메소드.
    @Post()
    @UseGuards(Jwt2faGuard)
    async confirm(@Req() req: Request, @Res() res, @Body() body){
        //디비에 있는 인증코드와 인풋 파라메터 값을 비교한다.
        const user = req.user as Users;
        const fa2Code = body.code;
        if (!(await bcrypt.compare(fa2Code, user.twofa_secret))){
            throw new UnauthorizedException('2단계 코드 불일치.');
        }
        res.clearCookie('jwt');
        const newToken = this.jwtServices.sign({ sub: user.id, oauthID: user.oauthID, twofa_verified: true }, { secret: process.env.JWTKEY });
        res.cookie('jwt', newToken);
		res.status(200).send();
    }
}
