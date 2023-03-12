import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Msgs { //채팅 대화목록.
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: number; //보낸 유저

	@Column()
	msg: string;

	@ManyToOne(()=>Chat, Chat=>Chat.msgs, { onDelete: 'CASCADE'})
	room:Chat
}