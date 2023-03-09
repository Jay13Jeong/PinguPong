import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DmList { //유저의 디엠 리스트 목록
	@PrimaryGeneratedColumn()
    pkid: number;

	@Column()
	userid: number; //디엠유저리스트

	@Column()
	targetid: number; //디엠유저리스트

	@Column()
	dmRoomName: string; //디엠룸네임
}