import { CanActivate, ExecutionContext, ImATeapotException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/users/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
		constructor(
			@Inject('AUTH_SERVICE') private authService: AuthService,
			@InjectRepository(User) private readonly userRepository: Repository<User>,
		) { }

	//리퀘스트의 토큰정보를 유효성 확인하고, 2fa검사 후 유저 정보를 컨트롤러에게 전달 할 수 있도록 하는 메소드.
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = request.cookies.jwt;
		if (token == undefined || token == '') {
			throw new UnauthorizedException('No token provided');
		}
		const obj = await this.authService.verifyJWToken(token);
		if (!obj)
			throw new UnauthorizedException('Object is undefined');

		const user = await this.userRepository.findOneBy({
			oauthID: obj.oauthID
		});
		if (!user)
			throw new UnauthorizedException('No User Found');
		if (!user.username || user.username === '')
			throw new ImATeapotException("username");
		if (user.twofa && !obj.twofa_verified)
			throw new ImATeapotException('twofa');
		request.user = user;
		return true;
	}
}

//2fa인증용 가드.
@Injectable()
export class Jwt2faGuard implements CanActivate {
		constructor(
			@Inject('AUTH_SERVICE') private authService: AuthService,
            @InjectRepository(User) private readonly userRepository: Repository<User>,
		) { }

    //리퀘스트의 토큰정보를 유효성 확인하고, 유저 정보를 컨트롤러에게 전달 할 수 있도록 하는 메소드.
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = request.cookies.jwt;
		if (token == undefined || token == '') {
			throw new UnauthorizedException('토큰 없음.');
		}
		const obj = await this.authService.verifyJWToken(token);
		if (!obj)
			throw new UnauthorizedException('토큰 정보 없음.');
		const user = await this.userRepository.findOneBy({
			oauthID: obj.oauthID
		});
		if (!user)
			throw new UnauthorizedException('토큰 유저 정보 없음');
		if (!user.username || user.username === '') //유저이름 정보 없음.
			throw new ImATeapotException("username");
		request.user = user; //리퀘스트에 유저 정보 전달.
		return true;
	}
}