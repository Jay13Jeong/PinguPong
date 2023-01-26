import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/modules/users/user.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class SecondAuthService {

    private code;

    // constructor(
    //     // @InjectRepository(User) private userRepository: Repository<User>,
    //     private mailerService: MailerService,
    // ) { this.code = Math.floor(10000 + Math.random() * 90000); }
   
    // async _send(targetEmail: string): Promise<boolean> {
    //     await this.mailerService.sendMail({
    //       to: targetEmail, //jjeong@student.42seoul.kr
    //       subject: '핑구퐁 메일 인증',
    //     //   template: `./${templateName}`,
    //       context : { sendcode:1111 },
    //     });
    //     return true;
    // }

}
