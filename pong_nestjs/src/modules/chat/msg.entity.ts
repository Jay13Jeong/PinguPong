import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class Message { //대화내용 메시지.
	@PrimaryGeneratedColumn()
	id: number; //메시지 구분용 고유 아이디.

	@Column()
	message: string; //메시지 내용.

	@ManyToOne(() => User, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	sender: User; //작성자.

	@ManyToOne(() => Chat, (chat) => chat.messages, {
		onDelete: 'CASCADE',
	})
	parent: Chat; //이 메시지의 채팅방.

	@Column()
	createdAt: string; //작성 일자.

	@BeforeInsert()
	updateDates() { //컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}