import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Mute { //채팅 음소거 목록 엔티티.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: string; //음소거당한 유저 Id

	@ManyToOne(()=>Chat, Chat=>Chat.muted, {eager: true, onDelete: 'CASCADE'})
	room:Chat
}