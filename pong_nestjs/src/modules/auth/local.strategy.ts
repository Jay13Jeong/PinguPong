import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//     constructor(private readonly authService: AuthService) {
//         super();
//     }

//     //로그인이 필요한 서비스인지 검사하는 메소드. 
//     async validate(username: string, password: string): Promise<any>{
//         const user = await this.authService.validateUser(username, password);

//         if (!user) {
//          throw new UnauthorizedException('Invalid user credentials');
//         }
//         return user;
//     }
// }