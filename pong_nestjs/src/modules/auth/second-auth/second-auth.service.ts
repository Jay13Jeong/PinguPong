import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SecondAuthService {

    constructor(private readonly mailerService: MailerService) {}

    public sendCode(targetEmail: string, code2fa : string): void {
        this.mailerService
          .sendMail({
            to: targetEmail, //'test@nestjs.com', // list of receivers
            from: '"PinguPong"<noreply@pingupong.com>', // sender address
            subject: '[핑구퐁] 2단계인증 코드 ✔', // Subject line
            text: '2FA', // plaintext body
            html: `code : <b>${code2fa}</b>`, // HTML body content
          })
          .then(() => {})
          .catch(() => {});
      }
}
