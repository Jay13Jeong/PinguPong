import { Controller, Get, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { SecondAuthService } from './second-auth.service';

@Controller('fa2')
export class SecondAuthController {
    constructor(
        private readonly secondAuthServices : SecondAuthService,
        private readonly usersService: UsersService,
    ){}

    @Get()
    sendMail(){
        this.secondAuthServices.sendCode('jgmg38@naver.com');
        this.secondAuthServices.sendCode('42.4.jjeong@gmail.com');
        this.secondAuthServices.sendCode('jjeong@student.42seoul.kr');
        console.log('sendMail with code...')
    }
}
