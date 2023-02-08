import { IsString, IsNotEmpty,} from "class-validator";

export class GameDto {

	@IsNotEmpty()
	@IsString()
	public mode? : string; //게임모드. 난이도.

	@IsNotEmpty()
	public winner : number; //승자 아이디.

	@IsNotEmpty()
	public loser : number; //패자 아이디.

	@IsNotEmpty()
	public winnerScore : number; //승자 점수.

	@IsNotEmpty()
	public loserScore : number; //패자 점수.
}