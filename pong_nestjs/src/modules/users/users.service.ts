import { BadRequestException, Injectable, NotFoundException, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from 'fs'
import { Users } from "./user.entity";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>, //user엔티티를 레파지토리로 사용 선언.
	) { }

    findAll(): Promise<Users[]>{
        return this.userRepository.find(); //모두 조회하는 메소드.
    }

    findOne(id: number): Promise<Users>{
        return this.userRepository.findOneBy({ id: id });
    }

    async create(user : Users) :Promise<void>{
        await this.userRepository.save(user);
    }

    async delete(id: number) : Promise<void>{
        await this.userRepository.delete(id);
    }

	/* Avatar */
	async getAvatar(id : number, res: any) {
		const user = await this.findUserById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		res.set({
			'Content-Type': `image/png`
		});
		return res.sendFile(user.avatar, { root: 'avatars' });
	}

	async postAvatar(user : Users, filename: string) {
		if (!user) {
			throw new NotFoundException('User not found');
		}
		if (user.avatar != 'default.jpeg') {
			this.deleteFile('avatars/' + user.avatar);
		}
		user.avatar = filename;
		// console.log(user);
		return await this.save(user);
	}

	async deleteAvatar(userID: number) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('해당 유저 없음');
		}

		if (user.avatar != 'default.jpeg') {
			this.deleteFile('avatars/' + user.avatar);
		}
		user.avatar = 'default.jpeg';
		this.save(user)
		return 204;
	}

	/* user */
	async getUser(id: number): Promise<Users> {
		const user = await this.findUserById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async updateUser(user: Users) {
		await this.userRepository.save(user)
		return { msg: "user info update OK" };
	}

	/* Helper functions */
	async deleteFile(filePath: string) {
		fs.unlink(filePath, (err) => {
			if (err) {
				throw new BadRequestException('파일 삭제 실패');
			}
		});
	}

	async findUserById(idArg: number): Promise<Users> {
		const user = await this.userRepository.findOneBy({
			id: idArg
		});
		return user;
	}

	async findUserByUsername(usernameArg: string): Promise<Users> {
		const user = await this.userRepository.findOneBy({
			username: usernameArg
		});
		return user;

	}

	async findUserByIdUsername(idArg: number, usernameArg: string): Promise<Users> {
		const user = await this.userRepository.findOneBy({
			id: idArg,
			username: usernameArg
		});
		return user;
	}

	async findUserByOauthID(oauthID: string): Promise<Users> {
		const user = await this.userRepository.findOneBy({
			oauthID: oauthID
		});
		return user;

	}

	async save(user: Users): Promise<Users> {
		return await this.userRepository.save(user);
	}

	async all(): Promise<Users[]> {
		return this.userRepository.find();
	}

	async getSortByRank(): Promise<Users[]> {
		return this.userRepository.find({
			order: {
				wins: "DESC",
				loses: "ASC",
				createdAt: "ASC",
			}
		});
	}
}