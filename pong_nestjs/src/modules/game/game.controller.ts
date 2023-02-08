import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User } from '../users/user.entity';
import { GameService } from './game.service';
import { Request, Response } from 'express';

@Controller('game')
export class GameController {
	constructor(
		private readonly gameService: GameService,
	) {}

    //디비 조회용 테스트 api.
	// @Get('test')
    // @UseGuards(JwtAuthGuard)
	// async getTest(@Req() req : Request,) {
    //     const user = req.user as User;
	// 	return await this.gameService.getHistoryByUserId(user.id);
	// }

    //선택한 유저의 전적을 가져오는 api.
	@Get(':id')
    @UseGuards(JwtAuthGuard)
	async getGameByUserID(@Req() req : Request,) {
        const user = req.user as User;
        // console.log("111");
        // console.log(await this.gameService.test());
		return await this.gameService.getHistoryByUserId(user.id);
	}

}
