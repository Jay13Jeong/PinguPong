import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //리퀘스트에서 추출한 토큰.
             ignoreExpiration: false, //false설정시 토큰이 만료되면 401을 응답하도록 설정.
             secretOrKey: process.env.JWTKEY, //.env의 토큰 시크릿 키.
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        const user = await this.userService.findOneById(payload.id);
        if (!user) {
            throw new UnauthorizedException('You are not authorized to perform the operation');
        }
        return payload;
    }
}