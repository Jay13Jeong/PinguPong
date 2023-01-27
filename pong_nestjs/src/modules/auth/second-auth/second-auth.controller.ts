import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { check } from 'prettier';
import { User } from 'src/modules/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { SecondAuthService } from './second-auth.service';

@Controller('fa2')
export class SecondAuthController {
    constructor(
        private readonly secondAuthServices : SecondAuthService,
        private readonly usersService: UsersService,
    ){}

    //2단계 인증이 켜져있는지 확인하는 메소드.
    @Get('/check')
    is2faOn(){
        //2fa페이지 접속시 먼저 이 api로 상태를 검사한다.
    }

    //jwt토큰 속 이메일로 인증코드 메시지를 전송하는 메소드.
    //동시에 디비에 메일로 보낸 2fa인증코드를 업데이트한다.
    @Get()
    sendMail(){
        this.secondAuthServices.sendCode('42.4.jjeong@gmail.com');
        this.secondAuthServices.sendCode('jjeong@student.42seoul.kr');
        console.log('sendMail with code...');
    }

    //디비의 2단계코드와 클라이언트에서 입력한 파라메터가 동일한지 비교하는 메소드.
    @Get()
    @UseGuards(JwtAuthGuard)
    confirm(){
        //디비에 있는 인증코드와 인풋 파라메터 값을 비교한다.
    }
}
