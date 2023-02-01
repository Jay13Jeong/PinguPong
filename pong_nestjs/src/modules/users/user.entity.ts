import { Column, BeforeInsert, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Friend } from "../friend/friend.entity";
// import { GameHistory } from "./GameHistory.entity";
// import { Friend } from "./Friend.entity";
// import { ApiProperty } from '@nestjs/swagger';
// import { Chat } from "./Chat.entity";


// https://www.tutorialspoint.com/typeorm/typeorm_entity.htm

@Entity() //유저 엔티티.
export class User {
	// @ApiProperty({ description: 'The id of the user', example: 1 })
	@PrimaryGeneratedColumn() //pk
	id: number; // 유저테이블 고유번호.

	// @ApiProperty({ description: 'The username of the user', example: 'rkieboom' })
	@Column({ unique: true, nullable: true })
	username?: string; // 이름.

	@Column({ unique: true, nullable: true })
	email?: string; // 이메일

	// @ApiProperty({ description: 'The avatar of the user', example: 'default.jpeg' })
	@Column({ default: 'default.png' })
	avatar: string; // 프로필사진. 기본 핑아 사진.

	// @ApiProperty({ example: 1 })
	// @Column({ default: 0 })
	// level: number; //레벨

	// @ApiProperty({ example: 0 })
	@Column({ default: 0})
	wins: number; //승리 횟수.

	// @ApiProperty({ example: 0 })
	@Column({ default: 0})
	loses: number; //패배 횟수.

	// @ApiProperty({description: 'Wether 2fa is enabled', example: 'false'})
	@Column({default: false})
	twofa: boolean; //2단계 인증 활성화 여부.

	// @ApiProperty({description: '2fa secret key'})
	@Column({unique: false, default: 'dummy_value'})
	twofa_secret: string; //2단계인증 암호화 시크릿 키.

	// @ApiProperty({ description: 'List of games that the user has won', type: () => GameHistory })
	// @OneToMany(() => GameHistory, (gameHistory) => gameHistory.winner)
	// games_won: GameHistory[]; //이긴 게임기록 리스트.

	// @ApiProperty({ description: 'List of games that the user has lost', type: () => GameHistory })
	// @OneToMany(() => GameHistory, (gameHistory) => gameHistory.loser)
	// games_lost: GameHistory[]; //패배 게임기록 리스트.

	// @ApiProperty({ description: 'List of friends that the user has sent', type: () => Friend })
	@OneToMany(() => Friend, (friend) => friend.sender) // Applicant
	sentFriendRequests: Friend[]; //초대한 사용자목록 리스트.
	
	// @ApiProperty({ description: 'List of friends that the user has recieved', type: () => Friend })
	@OneToMany(() => Friend, (friend) => friend.reciever) // Recipient
	receivedFriendRequests: Friend[]; //초대한 사용자 목록 리스트.

	// @ApiProperty({ description: 'List of chats connected to the user', type: () => Chat })
	// @ManyToMany(() => Chat, (chat) => chat.users)
	// chats: Chat[]; //참여중인 채팅방 목록 리스트.

	// @ApiProperty({ description: 'the id of the oath parent', example: 216532132 })
	@Column({ default: '', unique: true })
	oauthID: string; //인트라api에서 부여한 고유 id

	// @ApiProperty({ description: 'Creation Date epoch', example: '1669318644507' })
	@Column()
	createdAt: string; //핑구퐁 아이디 생성일.

	@BeforeInsert()
	updateDates() { //핑구퐁 아이디 생성일을 디비에 맞는 데이트 타입으로 바꿔서 넣어주는 메소드.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}

	// @BeforeInsert()
	// createSecret() { //2단계인증 암호화용 시크릿 키를 자동으로 생성해서 넣어주는 메소드.
	// 	this.twofa_secret = authenticator.generateSecret();
	// }
}
