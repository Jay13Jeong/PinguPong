import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/user.entity";
import { Message } from "./msg.entity";

// export enum ChatType {
// 	PRIVATE = "PRIVATE", //개인 디엠 모드.
// 	GROUP = "GROUP", //공개 단톡방 모드.
// 	GROUP_PROTECTED = "GROUP_PROTECTED", //비밀번호 단톡방 모드.
// }

@Entity()
export class Ban { //채팅차단 목록 엔티티.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: string; //밴당한 유저 Id
}

@Entity()
export class Mute { //채팅 음소서 목록 엔티티.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: string; //음소거당한 유저 Id
}

@Entity()
export class Chat { //채팅방 엔티티.
	@PrimaryGeneratedColumn()
	pkid: number; //채팅방 아이디.

	// @Column({
	// 	type: "enum",
	// 	enum: ChatType,
	// })
	// type: ChatType; //채팅방 유형.(디엠인지 단톡방인지)

	@Column({ nullable: true })
	name: string; //채팅방 이름.
	
	@Column("int")
	adminIDs: number; //방장 아아디.

	@Column('jsonb', {nullable: true})
	banned: Ban[]; //채팅차단시킨 대상 목록.

	@Column("int", { array: true, nullable: true })
	muted: Mute[]; //음소거 시킨 대상.

	@ManyToMany(() => Users, (user) => user.chats, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinTable()
	users: Users[]; //참가자 리스트.

	@Column()
	secret: boolean; //비밀방여부

	@Column({ nullable: true })
	password: string; //채팅방 비번.

	// @OneToMany(() => Message, (message) => message.parent, {
	// 	onDelete: 'CASCADE',
	// })
	// @JoinTable()
	// messages: Message[]; //채팅 대화 내용.

	// @Column()
	// createdAt: string; //채팅방 생성일.

	// @BeforeInsert()
	// updateDates() { //생성일 디비용 컨버터.
	// 	const date = new Date().valueOf() + 3600;
	// 	this.createdAt = date.toString();
	// }
}