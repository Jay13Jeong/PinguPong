import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-42';
import { AuthService } from "../auth.service";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.AUTH_CLIENT_ID,
			clientSecret: process.env.ACCESS_SECRET,
			callbackURL: process.env.AUTH_CALLBACK_URL,
			scope: ['public'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const user = await this.authService.validateUser({
			username: profile.username, //ex. jjeong
			email: profile.emails[0].value,
			oauthID: profile.id, //ex. 85322
		});
		return user || null; //user 반환을 시도하고 안되면 null 반환.
	}
}