import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SecondAuthService {

    private code;

    // constructor(@InjectRepository(User) private userRepository: Repository<User>, private mailerService: MailerService) {
    //   this.code = Math.floor(10000 + Math.random() * 90000);
    // }
   
    // async sendConfirmedEmail(user: User) {
    //   const { email, fullname } = user
    //   await this.mailerService.sendMail({
    //     to: email,
    //     subject: 'Welcome to Nice App! Email Confirmed',
    //     template: 'confirmed',
    //     context: {
    //       fullname,
    //       email
    //     },
    //   });
    // }
   
    // async sendConfirmationEmail(user: any) {
    //   const { email, fullname } = await user
    //   await this.mailerService.sendMail({
    //     to: email,
    //     subject: 'Welcome to Nice App! Confirm Email',
    //     template: 'confirm',
    //     context: {
    //       fullname,
    //       code: this.code
    //     },
    //   });
    // }

    // async signup(user: User): Promise<any> {
    //     try{
    //        const salt = await bcrypt.genSalt();
    //        const hash = await bcrypt.hash(user.password, salt);
    //        const reqBody = {
    //          fullname: user.fullname,
    //          email: user.email,
    //          password: hash,
    //          authConfirmToken: this.code,
    //        }
    //        const newUser = this.userRepository.insert(reqBody);
    //        await this.sendConfirmationEmail(reqBody);
    //        return true
    //     }catch(e){
    //         return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async signin(user: User, jwt: JwtService): Promise<any> {
    //     try{
    //        const foundUser = await this.userRepository.findOne({ email: user.oauthID });
    //        if (foundUser) {
    //          if (foundUser.isVerified) {
    //            if (bcrypt.compare(user.password, foundUser.password)) {
    //              const payload = { email: user.email };
    //              return {
    //                token: jwt.sign(payload),
    //              };
    //            }
    //          } else {
    //            return new HttpException('Please verify your account', HttpStatus.UNAUTHORIZED)
    //          }
    //          return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    //        }
    //        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    //     }catch(e){
    //     return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
