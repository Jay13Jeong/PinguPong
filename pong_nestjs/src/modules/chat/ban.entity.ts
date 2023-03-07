import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Ban { //채팅차단 목록 엔티티.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: string; //밴당한 유저 Id

	@ManyToOne(()=>Chat, Chat=>Chat.banned, {eager: true, onDelete: 'CASCADE'})
	room:Chat
}