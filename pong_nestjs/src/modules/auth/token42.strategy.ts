import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

//쿠키에서 42베어러 엑세스 토큰만 골라서 반환하는 메소드. (아래 클래스에 넣기)
function get42Token(req): string {
    if (!req.headers.cookie) return '';
    const token = req.headers.cookie
      .split('; ')
      .find((cookies: string) => cookies.startsWith('access_token')) //access_token의 키값을 찾는다.
      .split('=')[1];
    return token;
  }

//컨트롤러의 가드에서 현재 전략을 호출시 생성자로 초기화 후 validate메소드를 호출한다.
//validate메소드의 반환값은 컨트롤러의 인자 @Req()로 들어간다.
@Injectable()
export class Token42Strategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
             jwtFromRequest: ExtractJwt.fromExtractors([get42Token]), //리퀘스트에서 엑세스 토큰을 추출.
             ignoreExpiration: false, //false설정시 토큰이 만료되면 401을 응답하도록 설정.
             secretOrKey: process.env.JWTKEY, //.env의 토큰 시크릿 키.
        });
    }
 
    //토큰 속의 유저정보와 디비 속의  유저정보를 비교해서 인가한다.
    async validate(payload: any) {
        // check if user in the token actually exist
        // const user = await this.userService.findById(payload.userid);
        // if (!user) {
        //     throw new UnauthorizedException('You are not authorized to perform the operation');
        // }
        // return user;
    }
}