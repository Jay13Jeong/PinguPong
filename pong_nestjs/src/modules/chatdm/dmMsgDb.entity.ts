import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DmMsgDb { //유저의 디엠방 메세지
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	dmRoomName: string; //디엠룸네임

	@Column()
	userid: number; //디엠유저아이디

	@Column()
	msg: string; //디엠유저아이디

}