import { Inject, Injectable, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; //암호화 라이브러리.
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import { AuthUserDto } from './dto/authUser.dto';
import { Users } from '../users/user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    ) { }

    //유저가 있다면 유저 정보 반환, 없다면 디비에 새로 유저를 넣고 유저 정보 반환. 
    async validateUser(details: AuthUserDto) {
      const user = await this.userRepository.findOneBy({
        oauthID: details.oauthID,
      });
  
      if (user)
        return user;
      details.username = 'no_init_' + details.oauthID;
      const newUser = this.userRepository.create(details);
      return this.userRepository.save(newUser);
    }

    //토큰을 생성하는 서비스.
    createToken(user: Users, twofa_verified: boolean) {
      return (
        this.jwtService.sign({ sub: user.id, oauthID: user.oauthID, twofa_verified: twofa_verified })
      )
    }

    //토큰의 유효성을 검사하는 메소드. 성공시 페이로드 반환 실패시 null반환.
    async verifyJWToken(token: string): Promise<any> {
      const options = { secret: process.env.JWTKEY };
      try {
        return await this.jwtService.verify(token, options);
      } catch (error) {
        return null;
      }
    }

    // ////// bcrypt service ////////////////////////////
    // //DB의 패스워드와 입력된 비번이 일치하는지 확인하는 메소드.
    // private async comparePassword(enteredPassword, dbPassword) {
    //     const match = await bcrypt.compare(enteredPassword, dbPassword);
    //     return match;
    // }

    // ////// jwt service ////////////////////////////
    // //사용자 정보로 토큰 생성해서 반환하는 메소드.
    // public async login(user) {
    //     const token = await this.generateToken(user);
    //     return { user, token };
    // }

    // //사용자 정보를 디비에 안전하게 저장후 토큰 발행후 토큰을 반환하는 메소드.
    // public async create(user) {
    //     // hash the password
    //     const pass = await this.hashPassword(user.password);

    //     // create the user
    //     const newUser = await this.userService.create({ ...user, password: pass });

    //     // tslint:disable-next-line: no-string-literal
    //     const { password, ...result } = newUser['dataValues'];

    //     // generate token
    //     const token = await this.generateToken(result);

    //     // return the user and the token
    //     return { user: result, token };
    // }

    // //토큰을 생성하고 반환하는 비공개 메소드.
    // private async generateToken(user) {
    //     const token = await this.jwtService.signAsync(user);
    //     return token;
    // }

    // //입력받은 비번을 해시값으로 바꾸는 메소드.
    // private async hashPassword(password) {
    //     // console.log("1111111");
    //     // console.log(password);
    //     const hash = await bcrypt.hash(password, 10);
    //     return hash;
    // }

}

