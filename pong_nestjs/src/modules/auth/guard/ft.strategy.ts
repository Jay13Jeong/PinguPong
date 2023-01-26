import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { json } from "express";
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
		// console.log(profile);
		// const b = JSON.parse(profile as string);
		// console.log(profile.photos[0].value);
		// console.log(profile.emails[0].value);
		// const {img_link, dummy_obj} = profile.image;
		const user = await this.authService.validateUser({
			username: profile.username, //ex. jjeong
			email: profile.emails[0].value,
			oauthID: profile.id, //ex. 85322
		});
		// if (!user) {
        //     throw new UnauthorizedException();
        // }
		return user || null;
		// return 1;
	}
}