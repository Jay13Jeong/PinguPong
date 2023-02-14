import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Message } from "./msg.entity";

export enum ChatType {
	PRIVATE = "PRIVATE", //개인 디엠 모드.
	GROUP = "GROUP", //공개 단톡방 모드.
	GROUP_PROTECTED = "GROUP_PROTECTED", //비밀번호 단톡방 모드.
}

@Entity()
export class Ban { //채팅차단 목록 엔티티.
	@PrimaryGeneratedColumn()
    id: number; //채팅차단 대상 유저 아이디.

    @Column({ nullable: true })
	unbannedTime: string; //차단 지속시간.
}

@Entity()
export class Chat { //채팅방 엔티티.
	@PrimaryGeneratedColumn()
	id: number; //채팅방 아이디.

	@Column({
		type: "enum",
		enum: ChatType,
	})
	type: ChatType; //채팅방 유형.(디엠인지 단톡방인지)

	@Column({ nullable: true })
	name: string; //채팅방 이름.
	
	@Column("int", { array: true })
	adminIDs: number[]; //방장 아아디.

	@Column('jsonb', {nullable: true})
	banned: Ban[]; //채팅차단시킨 대상 목록.

	@Column("int", { array: true, nullable: true })
	muted: number[]; //벙어리 시킨 대상.

	@ManyToMany(() => User, (user) => user.chats, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinTable()
	users: User[]; //참가자 리스트.
	
	@OneToMany(() => Message, (message) => message.parent, {
		onDelete: 'CASCADE',
	})
	@JoinTable()
	messages: Message[]; //채팅 대화 내용.

	@Column({ nullable: true })
	password: string; //채팅방 비번.

	@Column()
	createdAt: string; //채팅방 생성일.

	@BeforeInsert()
	updateDates() { //생성일 디비용 컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}