import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

//쿠키에서 42베어러 엑세스 토큰만 골라서 반화
function get42Token(req): string {
    if (!req.headers.cookie) return '';
    const token = req.headers.cookie
      .split('; ')
      .find((cookie: string) => cookie.startsWith('access_token'))
      .split('=')[1];
    return token;
  }

@Injectable()
export class Token42Strategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
             jwtFromRequest: ExtractJwt.fromExtractors([get42Token]), //리퀘스트에서 엑세스 토큰을 추출.
             ignoreExpiration: false, //false설정시 토큰이 만료되면 401을 응답하도록 설정.
             secretOrKey: process.env.JWTKEY, //.env의 토큰 시크릿 키.
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        // const user = await this.userService.findById(payload.sub);
        // if (!user) {
        //     throw new UnauthorizedException('You are not authorized to perform the operation');
        // }
        // return user;
    }
}