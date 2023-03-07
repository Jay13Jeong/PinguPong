import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-google-oauth2';
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_ACCESS_SECRET,
			callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
			scope: ['email', 'profile'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const user = await this.authService.validateUser({
			// username: profile.username, //ex. jjeong
			email: profile.emails[0].value,
			oauthID: profile.id, //ex. 85322
		});
		return user || null; //user 반환을 시도하고 안되면 null 반환.
	}
}