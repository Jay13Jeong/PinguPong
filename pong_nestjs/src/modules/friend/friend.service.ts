import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/user.entity';
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
    async invite(sender: Users, recieverID: number): Promise<Friend> {
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
		return this.repo.save(friendship);
	}

	async  delete(sender: Users, recieverID: number): Promise<Friend> {
		if (sender.id == recieverID)
			throw new BadRequestException('본인 친구삭제 불가.');
		const reciever = await this.userService.findUserById(recieverID);
		const friendship = await this.repo.findOne({
			relations: ['sender', 'reciever'],
			where: [
				{ sender:  { id: sender.id }, reciever: { id: reciever.id } },
				{ sender:  { id: reciever.id }, reciever: { id: sender.id } },
			], 
		});
		if (!friendship)
			throw new NotFoundException('끊을 친구 대상 없음.');
		return await this.repo.remove(friendship);
	}

	async block(sender: Users, recieverID: number): Promise<Friend> {
		if (sender.id == recieverID)
			throw new BadRequestException('본인 차단 불가.');
		const reciever = await this.userService.findUserById(recieverID); //차단대상의 정보를 얻어온다.
			if (!reciever)
				throw new NotFoundException('차단 대상이 존재하지 않음.');
		var friendship = await this.repo.findOne({ //기존 우호적 친구관계가 있는지 찾는다.
			relations: ['sender', 'reciever'],
			where: [
				{ sender:  { id: sender.id }, reciever: { id: reciever.id }, status: 'pending' },
				{ sender:  { id: reciever.id }, reciever: { id: sender.id }, status: 'pending' },
				{ sender:  { id: sender.id }, reciever: { id: reciever.id }, status: 'accepted' },
				{ sender:  { id: reciever.id }, reciever: { id: sender.id }, status: 'accepted' },
				{ sender:  { id: sender.id }, reciever: { id: reciever.id }, status: 'blocked' },
			],
		});
		if (friendship) { //차단 대상이 친구목록 테이블에 있을 때 관계를 끊음.
			if (friendship.status === 'blocked')
				throw new NotFoundException('이미 차단된 대상');
			await this.repo.remove(friendship)
		}
		friendship = this.repo.create({
			sender: sender,
			reciever: reciever,
			status: 'blocked'
		});
		return this.repo.save(friendship);
	}

	async unblock(senderID: number, recieverID: number): Promise<Friend> {
		if (senderID == recieverID)
			throw new BadRequestException('잘못된 대상(본인)');
		const sender = await this.userService.findUserById(senderID);
		const reciever = await this.userService.findUserById(recieverID);
		const friendship = await this.repo.findOne({
			relations: ['sender', 'reciever'],
			where: [
				{ sender:  { id: sender.id }, reciever: { id: reciever.id } },
			],
		});
		if (!friendship)
			throw new NotFoundException('차단해제 대상 없음.');
		if (friendship.status != 'blocked')
			throw new BadRequestException('차단 되지 않은 대상.');
		return await this.repo.remove(friendship);
	}

	async getFriends(id: number): Promise<Friend[]> {
		const user = await this.userService.findUserById(id);
		if (!user)
			throw new NotFoundException('User not found');
		const friends = await this.repo.find({
			relations: ['sender', 'reciever'],
			where: [
				{ sender: { id: user.id }, status: 'accepted' },
				{ reciever: { id: user.id }, status: 'accepted' },
			],
		});
		return friends;
	}

	async getPendings(id: number): Promise<Friend[]> {
		const user = await this.userService.findUserById(id);
		if (!user)
			throw new NotFoundException('User not found');
		const friends = await this.repo.find({
			relations: ['sender', 'reciever'],
			where: [
				// { sender: { id: user.id }, status: 'pending' },
				{ reciever: { id: user.id }, status: 'pending' },
			],
		});
		return friends;
	}

	async getBlocks(id: number): Promise<Friend[]> {
		const user = await this.userService.findUserById(id);
		if (!user)
			throw new NotFoundException('User not found');
		const friends = await this.repo.find({
			relations: ['sender', 'reciever'],
			where: [
				{ sender: { id: user.id }, status: 'blocked' },
			],
		});
		return friends;
	}

	async getReversBlocks(id: number): Promise<Friend[]> {
		const user = await this.userService.findUserById(id);
		if (!user)
			throw new NotFoundException('User not found');
		const friends = await this.repo.find({
			relations: ['sender', 'reciever'],
			where: [
				{ reciever: { id: user.id }, status: 'blocked' },
			],
		});
		return friends;
	}

	async getRelate(id: number, targetID: number): Promise<string> {
		const friends = await this.repo.findOne({
			relations: ['sender', 'reciever'],
			where: [
				{ sender:  { id: id }, reciever: { id: targetID }, status: 'pending' },
				{ sender:  { id: targetID }, reciever: { id: id }, status: 'pending' },
				{ sender:  { id: id }, reciever: { id: targetID }, status: 'accepted' },
				{ sender:  { id: targetID }, reciever: { id: id }, status: 'accepted' },
				{ sender:  { id: id }, reciever: { id: targetID }, status: 'blocked' },
			],
		});
		if (!friends){
			return 'nothing';
		}
		return friends.status;
	}
}
