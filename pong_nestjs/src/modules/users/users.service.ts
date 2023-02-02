import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from 'fs'
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {

    constructor(
        // private jwtService: JwtService,
        @InjectRepository(User) private readonly userRepository: Repository<User>, //user엔티티를 레파지토리로 사용 선언.
        ) { }

    findAll(): Promise<User[]>{
        return this.userRepository.find(); //모두 조회하는 메소드.
    }

    findOne(id: number): Promise<User>{
        return this.userRepository.findOneBy({
			id: id
		});
    }

    async create(user : User) :Promise<void>{
        await this.userRepository.save(user);
    }

    async delete(id: number) : Promise<void>{
        await this.userRepository.delete(id);
    }

	/* Avatar */
	async getAvatar(userID: number, res: any) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		res.set({
			'Content-Type': `image/png`
		});
		return res.sendFile(user.avatar, { root: 'uploads' });
	}
	async postAvatar(userID: number, filename: string) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.avatar != 'default.jpeg') {
			this.deleteFile('uploads/' + user.avatar);
		}
		user.avatar = filename;
		return await this.save(user);
	}
	async deleteAvatar(userID: number) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.avatar != 'default.jpeg') {
			this.deleteFile('uploads/' + user.avatar);
		}
		user.avatar = 'default.jpeg';
		this.save(user)
		return 204;
	}

	/* twofa */
	async getTwoFA(userID: number) {
		var qrCode: any;

		// const user = await this.findUserById(userID);
		// if (!user) {
		// 	throw new NotFoundException('User not found');
		// }
		// const otpauth = authenticator.keyuri(user.username, 'ft_transendence', user.twofa_secret);
		// await qrcode.toDataURL(otpauth, {width: 350})
		// .then(res => {
		// 	qrCode = res;
		// })
		return await qrCode;
	}

	async getTwoFAStatus(userID: number) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user.twofa;
	}

	async verifyTwoFA(userID: number, res: any, token: string) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		// if (authenticator.verify({token: token, secret: user.twofa_secret}) === false)
		// 	throw new UnauthorizedException('Invalid 2fa code.');

		// res.clearCookie('jwt')
		// const newToken = this.jwtService.sign({ sub: user.id, oauthID: user.oauthID, twofa_verified: true }, { secret: process.env.JWT_SECRET });
		// res.cookie('jwt', newToken);
		res.status(200).send();
	}

	async enableTwoFA(userID: number, token: string) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		if (user.twofa)
			return null; //already enabled error!
		// if (authenticator.verify({token: token, secret: user.twofa_secret})) {
		// 	user.twofa = !user.twofa;
		// 	this.userRepository.save(user);
		// 	return 'OK';
		// }
		throw new UnauthorizedException('Invalid 2fa code.');
	}

	async disableTwoFa(userID: number, token: string) {
		const user = await this.findUserById(userID);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!user.twofa)
			return null; //already enabled error!
		// if (authenticator.verify({token: token, secret: user.twofa_secret})) {
		// 	user.twofa = !user.twofa;
		// 	this.userRepository.save(user);
		// 	return 'OK';
		// }
		throw new UnauthorizedException('Invalid 2fa code.');
	}


	/* user */
	async getUser(id: number): Promise<User> {
		const user = await this.findUserById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	// patch user
	async updateUser(user: User) {
		// const user = await this.findUserById(userID);
		// if (!user) {
		// 	throw new UserNotFoundException();
		// }
		// if (dto.username) {
		// 	if (user.username == dto.username) {
		// 		throw new NotModifiedException('Username is already set to ' + dto.username);
		// 	}
		// 	user.username = dto.username;
		// }
		// if (dto.twofa) {
		// 	if (user.twofa == dto.twofa) {
		// 		throw new NotModifiedException('twofa is already set to ' + dto.twofa);
		// 	}
		// 	user.twofa = dto.twofa;
		// }
		await this.userRepository.save(user)
		// .catch((err) => {
		// 	if (err.code === '23505') {
		// 		throw new BadRequestException('Username already exists');
		// 	}
		// });
		return { msg: "user info update OK" };
	}

	/* Helper functions */
	async deleteFile(filePath: string) {
		fs.unlink(filePath, (err) => {
			if (err) {
				throw new BadRequestException('Could not delete old avatar');
			}
		});
	}
	async findUserById(idArg: number): Promise<User> {
		const user = await this.userRepository.findOneBy({
			id: idArg
		});
		return user;
	}
	async findUserByUsername(usernameArg: string): Promise<User> {
		const user = await this.userRepository.findOneBy({
			username: usernameArg
		});
		return user;

	}
	async findUserByIdUsername(idArg: number, usernameArg: string): Promise<User> {
		const user = await this.userRepository.findOneBy({
			id: idArg,
			username: usernameArg
		});
		return user;
	}
	async findUserByOauthID(oauthID: string): Promise<User> {
		const user = await this.userRepository.findOneBy({
			oauthID: oauthID
		});
		return user;

	}
	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}
	async all(): Promise<User[]> {
		return this.userRepository.find();
	}
}