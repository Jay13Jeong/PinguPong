import { BeforeInsert, Column, Entity, JoinTable, ManyToOne,  ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/user.entity";
import { Ban } from "./ban.entity";
import { Message } from "./msg.entity";
import { Mute } from "./mute.entity";
import { RoomUserId } from "./room.entity";

// export enum ChatType {
// 	PRIVATE = "PRIVATE", //개인 디엠 모드.
// 	GROUP = "GROUP", //공개 단톡방 모드.
// 	GROUP_PROTECTED = "GROUP_PROTECTED", //비밀번호 단톡방 모드.
// }

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
	roomName: string; //채팅방 이름.

	@Column("int")
	adminId: number; //방장 아아디.

	@OneToMany(()=>Ban, Ban => Ban.room,{ nullable: true, cascade: true})
	banned?: Ban[]; //채팅차단시킨 대상 목록.

	@OneToMany(()=>Mute, Mute => Mute.room,{ nullable: true, cascade: true})
	muted?: Mute[]; //음소거 시킨 대상.

	@OneToMany(()=>RoomUserId, RoomUserId => RoomUserId.userIds,{ nullable: true, cascade: true})
	userIds?: RoomUserId[]; //룸 유저 Id 시킨 대상.

	// @ManyToMany(() => Users, (user) => user.chats, {
	// 	onDelete: 'CASCADE',
	// 	eager: true,
	// })
	// @JoinTable()
	// users: Users[]; //참가자 리스트.

	@Column()
	secret: boolean; //비밀방여부

	@Column({ nullable: true })
	password: string; //채팅방 비번.

	// @OneToMany(() => Message, (message) => message.parent, {
	// 	onDelete: 'CASCADE',
	// })
	// @JoinTable()
	// messages: Message[]; //채팅 대화 내용.

	@Column()
	createdAt: string; //채팅방 생성일.

	@BeforeInsert()
	updateDates() { //생성일 디비용 컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}