import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
	private readonly authService: AuthService,
  ) {
	super({
	  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	  ignoreExpiration: false,
	  secretOrKey: process.env.JWTKEY,
	});
  }

  async validate({ iat, exp, sub, oauthID }, done) {
	const user = await this.authService.validateUser({
		oauthID: oauthID,
	});
	if (!user)
		return new UnauthorizedException('DB 유저 정보 조회 실패 :' + __filename); //뒤에 파일명 포함 절대경로를 붙인다.(filename매크로)
	if (!user.username)
		throw new UnauthorizedException('DB 유저 이름 조회 실패 :' + __filename);
	done(null, user);
  }
}