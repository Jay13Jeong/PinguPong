import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { AuthUserDto } from '../auth/dto/authUser.dto';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class UsersService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(USER_REPOSITORY) private readonly userRepo: Repository<User>,
        ) { }

    async createUser(userDto: AuthUserDto): Promise<User> {
        // const user = this.userRepository.create(userDto);
        // return await this.userRepository.save(user);

        return await this.userRepository.create(userDto);
    }
    findByEmail(arg0: { email: string; }): any {
        throw new Error('Method not implemented.');
    }

    // guide tests /////////////
    //유저테이블에 인서트.
    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    //유저테이블에서 메일주소로 찾기.
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    //유저테이블에서 아이디로 찾기.
    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }
}