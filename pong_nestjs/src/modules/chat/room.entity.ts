import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class RoomUserId { //채팅 유저id 목록 엔티티.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: number; //유저 Id

	@ManyToOne(()=>Chat, Chat=>Chat.userIds, {onDelete: 'CASCADE'})
	userIds:Chat
}