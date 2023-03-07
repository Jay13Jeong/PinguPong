import { Column, BeforeInsert, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/user.entity";

@Entity() //친구 목록
export class Friend {
	@PrimaryGeneratedColumn()
	id: number; //친구 목록 인덱스 pk.

	@ManyToOne(() => Users, (user) => user.sentFriendRequests, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	sender: Users; //초대한 유저 정보.

	@ManyToOne(() => Users, (user) => user.receivedFriendRequests, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	reciever: Users; //수신한 유저 정보.

	@Column({default: 'pending'})
	status: string; //친구관계 여부 (기본 '보류중').

	@Column()
	createdAt: string; //이벤트 생성 날짜.

	@BeforeInsert()
	updateDates() { //날짜 시간 디비용 컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}