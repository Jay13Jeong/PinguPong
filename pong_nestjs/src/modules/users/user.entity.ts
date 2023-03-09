import { Column, BeforeInsert, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "../chat/chat.entity";
import { Friend } from "../friend/friend.entity";
import { Game } from "../game/game.entity";

@Entity() //유저 엔티티.
export class Users {
	@PrimaryGeneratedColumn() //pk
	id: number; // 유저테이블 고유번호.

	@Column({ unique: true, nullable: true })
	username?: string; // 이름.

	@Column({ unique: true, nullable: true })
	email?: string; // 이메일

	@Column({ default: 'default.jpeg' })
	avatar: string; // 프로필사진. 기본 핑아 사진.

	@Column({ default: 0})
	wins: number; //승리 횟수.

	@Column({ default: 0})
	loses: number; //패배 횟수.

	@Column({default: false})
	twofa: boolean; //2단계 인증 활성화 여부.

	@Column({unique: false, default: 'dummy_value'})
	twofa_secret: string; //2단계인증 암호화 시크릿 키.

	@OneToMany(() => Game, (game) => game.winner)
	games_won: Game[]; //이긴 게임기록 리스트.

	@OneToMany(() => Game, (game) => game.loser)
	games_lost: Game[]; //패배 게임기록 리스트.

	@OneToMany(() => Friend, (friend) => friend.sender) // Applicant
	sentFriendRequests: Friend[]; //초대한 사용자목록 리스트.

	@OneToMany(() => Friend, (friend) => friend.reciever) // Recipient
	receivedFriendRequests: Friend[]; //초대한 사용자 목록 리스트.

	@Column({ default: '', unique: true })
	oauthID: string; //인트라api에서 부여한 고유 id

	@Column()
	createdAt: string; //핑구퐁 아이디 생성일.

	@BeforeInsert()
	updateDates() { //핑구퐁 아이디 생성일을 디비에 맞는 데이트 타입으로 바꿔서 넣어주는 메소드.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}
