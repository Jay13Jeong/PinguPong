import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/user.entity";

@Entity()
export class Game {

	@PrimaryGeneratedColumn()
	id: number; //게임 방 아이디.

	@Column({ nullable: true })
	mode: string; // 난이도.

    /*
    eager : 하위 엔티티도 동시에 로드. 이거 안하면 typeorm은 다른 orm과 다르게 하위 엔티티 디비에서 못가져옴.
    N + 1문제.
    cascase : 유저 삭제시 관련 게임데이터도 모두 삭제.
    */
	@ManyToOne(() => Users, (user) => user.games_won, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	winner: Users; //이긴 유저.

	@ManyToOne(() => Users, (user) => user.games_lost, {	eager: true, onDelete: 'CASCADE'})
	@JoinColumn()
	loser: Users; //패배 유저.

	@Column({ default: false })
	draw: boolean; //무승부 여부.

	@Column({ default: 0 })
	winnerScore: number; //이긴 유저 스코어.

	@Column({ default: 0 })
	loserScore: number; //패배 유저 스코어.

	@Column()
	createdAt: string; //방 생성 일자.

	@BeforeInsert()
	updateDates() { //방 생성일자 디비용 컨버터.
		const date = new Date().valueOf() + 3600;
		this.createdAt = date.toString();
	}
}