import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; //암호화 라이브러리.
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    //디비와 유저 정보를 확인하는 메소드.
    async validateUser(username: string, pass: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    ////// bcrypt service ////////////////////////////
    //DB의 패스워드와 입력된 비번이 일치하는지 확인하는 메소드.
    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    ////// jwt service ////////////////////////////
    //사용자 정보로 토큰 생성해서 반환하는 메소드.
    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    //사용자 정보를 디비에 안전하게 저장후 토큰 발행후 토큰을 반환하는 메소드.
    public async create(user) {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const token = await this.generateToken(result);

        // return the user and the token
        return { user: result, token };
    }

    //토큰을 생성하고 반환하는 비공개 메소드.
    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    //입력받은 비번을 해시값으로 바꾸는 메소드.
    private async hashPassword(password) {
        // console.log("1111111");
        // console.log(password);
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

}