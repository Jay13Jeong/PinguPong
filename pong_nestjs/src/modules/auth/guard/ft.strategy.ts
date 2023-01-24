import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-42';
import { AuthService } from "../auth.service";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		// console.log(process.env.AUTH_CLIENT_ID);
		// console.log(process.env.ACCESS_SECRET);
		// console.log(process.env.AUTH_CALLBACK_URL);
		super({
			clientID: process.env.AUTH_CLIENT_ID,
			clientSecret: process.env.ACCESS_SECRET,
			callbackURL: process.env.AUTH_CALLBACK_URL,
			scope: ['public'],
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		// console.log("FortyTwoStrategy-validate-----");
		const user = await this.authService.validateUser({
			// username: profile.username
			oauthID: profile.id,
		});
		// if (!user) {
        //     throw new UnauthorizedException();
        // }
		return user || null;
		// return 1;
	}
}