import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { send } from 'process';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Friend } from './friend.entity';

@Injectable()
export class FriendService {
    constructor(
		@InjectRepository(Friend) private repo: Repository<Friend>,
		private readonly userService: UsersService,
		// private readonly chatService: ChatService,
	) {}

    //친구목록 테이블에 초대 데이터를 넣고 해당 행을 반환하는 서비스.
    async invite(sender: User, recieverID: number): Promise<Friend> {
		if (sender.id == recieverID)
			throw new BadRequestException('본인 친구초대 불가.');
		const reciever = await this.userService.findUserById(recieverID);
			if (!reciever)
				throw new NotFoundException('초대 할 대상이 존재하지 않음.');
		var friendship = await this.repo.findOne({
			relations: ['sender', 'reciever'],
			where: [
				{ sender:  { id: sender.id }, reciever: { id: reciever.id } },
				{ sender:  { id: reciever.id }, reciever: { id: sender.id } },
			],
		});
		if (friendship) { //친구목록 테이블에 친구요청이 있을 때.
			if (friendship.status == 'accepted')
				throw new BadRequestException('이미 친구 관계.');
			if (friendship.status == 'blocked')
				throw new BadRequestException('차단한 유저 초대 불가.');
			if (friendship.status == 'pending') {
				if (sender.id != friendship.sender.id) { //상대방이 이미 나에게 초대를 보냈다면 수락처리.
					friendship.status = 'accepted';
				}
				else
					throw new ForbiddenException('초대 수락 대기중...');
			}
			else
				throw new BadRequestException('이미 친구 관계.');
		}
		else { //친구목록 테이블에 친구요청이 없다면 새로 만들어준다.
			friendship = this.repo.create({
				sender: sender,
				reciever: reciever,
			});
		}
		/* If friendship is accepted create a chat */
		// if (friendship.status == 'accepted') {
		// 	const payload: createChatDto = {
		// 		type: ChatType.PRIVATE,
		// 		users: [
		// 			friendship.sender.id,
		// 			friendship.reciever.id,
		// 		]
		// 	}
		// 	this.chatService.createChat(friendship.sender.id, payload);
		// }
		return this.repo.save(friendship);
	}
}
