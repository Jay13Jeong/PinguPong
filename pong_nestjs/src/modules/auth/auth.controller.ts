import { Controller, Body, Post, UseGuards, Res, Get, Req, UseFilters, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { User } from '../users/user.entity';
import { FtAuthGuard } from './guard/ft.guard';
import { ViewAuthFilter } from 'src/core/filter/unauth.filter';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        // private readonly usersService: UsersService,
    ) {}

    private usersMap = new Map(); //{키 : 42권한코드, 값 : 유저 엔티티}

	//42로그인 창을 띄우는 메소드.
	@Get('42/login')
	@UseGuards(FtAuthGuard)
    @UseFilters(ViewAuthFilter)
	login() {}

	//42로그인 후 받은 42엑세스 토큰으로 jwt설정 및 응답하는 메소드.
	@Get('42/callback')
	@UseGuards(FtAuthGuard)
    @UseFilters(ViewAuthFilter)
	callback(@Req() req: Request, @Res() res: Response,) {
        return this.responseWithJWT(req, res);
	}

	private responseWithJWT(req: Request, res: Response) {
		const user = req.user as User;
		if (!user)
			return res.redirect('http://localhost/auth/fa2');
		const token = this.authService.createToken(user, false);
		res.cookie('jwt', token, { httpOnly: true });
		res.header('Authorization', 'JWT ' + token);
		res.redirect('http://localhost/auth/fa2');
		return { token };
	}

}