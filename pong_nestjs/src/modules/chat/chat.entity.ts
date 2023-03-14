import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ban } from "./ban.entity";
import { Msgs } from "./msg.entity";
import { Mute } from "./mute.entity";
import { RoomUserId } from "./room.entity";

@Entity()
export class Chat { //채팅방 엔티티.
	@PrimaryGeneratedColumn()
	pkid: number; //채팅방 아이디.

	@Column()
	roomName: string; //채팅방 이름.

	@Column("int")
	adminId: number; //방장 아아디.

	@OneToMany(()=>Ban, Ban => Ban.room,{ nullable: true, eager: true, cascade: true})
	banned?: Ban[]; //채팅차단시킨 대상 목록.

	@OneToMany(()=>Mute, Mute => Mute.room,{ nullable: true, eager: true, cascade: true})
	muted?: Mute[]; //음소거 시킨 대상.

	@OneToMany(()=>RoomUserId, RoomUserId => RoomUserId.userIds,{ nullable: true, eager: true, cascade: true})
	userIds?: RoomUserId[]; //룸 유저 Id 시킨 대상.

	@OneToMany(()=>Msgs, Msgs => Msgs.room,{ nullable: true, eager: true, cascade: true})
	msgs?: Msgs[]; //룸 유저 Id 시킨 대상.

	@Column()
	secret: boolean; //비밀방여부

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