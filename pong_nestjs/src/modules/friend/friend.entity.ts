import { Column, BeforeInsert, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity() //친구 목록
export class Friend {
	// @ApiProperty({ description: 'The id of the friendship', example: 1 })
	@PrimaryGeneratedColumn()
	id: number; //친구 목록 인덱스 pk.

	// @ApiProperty({ description: 'the sender of the friendship', type: () => User })
	@ManyToOne(() => User, (user) => user.sentFriendRequests, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	sender: User; //초대한 유저 정보.

	// @ApiProperty({ description: 'the reciever of the friendship', type: () => User })
	@ManyToOne(() => User, (user) => user.receivedFriendRequests, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	reciever: User; //수신한 유저 정보.

	// @ApiProperty({ description: 'The status of the friendship', example: 'accepted' })
	@Column({default: 'pending'})
	status: string; //친구관계 여부 (기본 '보류중').

	// @ApiProperty({ description: 'Creation Date epoch', example: '1669318644507' })
	@Column()
	createdAt: string; //이벤트 생성 날짜.

	@BeforeInsert()
	updateDates() { //날짜 시간 디비용 컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}