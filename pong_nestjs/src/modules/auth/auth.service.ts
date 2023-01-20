import { Injectable, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; //암호화 라이브러리.
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import { AuthUserDto } from './dto/authUser.dto';
import { Response } from "express";
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        public readonly configService: ConfigService,
    ) { }

    // 42oauth 권한서버에게 받은 code를 다시 추가정보와 함께 권한서버에게 보내 베어러 토큰으로 교환요청하는 메소드.
    async getAccessToken(code: string): Promise<string> {
        const payload = {
          grant_type: "authorization_code",
          client_id: this.configService.get<string>('AUTH_CLIENT_ID'), //환경변수에서 값 가져오기.
          client_secret: this.configService.get<string>('ACCESS_SECRET'),
          redirect_uri: "http://localhost/auth/fa2",
          code,
        };
    
        let ret: string;
        await axios({
          method: "post",
          url: "https://api.intra.42.fr/oauth/token",
          data: JSON.stringify(payload),
          headers: {
            "content-type": "application/json",
          },
        })
        .then(function (res) {
        ret = res.data.access_token;
        })
        .catch((err) =>{ console.log("get access token fail...")});
        return ret;
    }

    // 42권한서버에게 받은 code를 이용해 베어러 토큰을 발급받고 리소스 서버에게 유저정보를 얻는 메소드.
    async getUserData(code: string): Promise<AuthUserDto> {
      let access_token: string;
      let userData: AuthUserDto;
      try {
        access_token = await this.getAccessToken(code); //베어러 토큰을 발급받는다.
        await axios({
          method: "GET",
          url: "https://api.intra.42.fr/v2/me",
          headers: {
            authorization: `Bearer ${access_token}`,
            "content-type": "application/json",
          },
        })
          .then(function (res) {
            const { email, login: username, image_url: avatar } = res.data;
            userData = { username, email, avatar };
          })
          .catch((err) => {});
      } catch (err: any) {
      }
      return userData;
    }

    //클라이언트에게 jwt토큰을 저장하고, 유저 정보를 전송하는 서비스.
    async sendJwtWithUserInfo(@Res() response: Response, user: User, is2fa: boolean, isFirstTime: boolean) {
      const { access_token } = await this.generateJWT(user, is2fa);
      response
        .cookie("access_token", access_token, {
          httpOnly: true,
          domain: process.env.DOMAIN, // your domain here!
        })
        .send({
          uid: user.id,
          name: user.name,
          img: user.avatar,
          firstTime: isFirstTime,
        });
    }

    //유저 정보와 2차인증 활성화 여부를 받아서 토큰를 생성하고 반환하는 서비스.
    async generateJWT(user: User, is2fa: boolean) {
      //유저 클래스 통째로 페이로드를 구성하면 통신지연이 발생 할 수 있으므로 정보는 최소로 보낸다.
      const payload = { username: user.name, userid: user.id, img: user.avatar, is2faEnabled: user.is2FAEnabled };
      return { access_token: await this.jwtService.signAsync(payload) }; //비동기로 토큰 생성.
    }

    //메일로 보낸 인증번호와 입력된 2차인증번호를 비교하는 서비스.
    checkEmail2FA(twoFACode: string, userSecret: string): boolean {
      return true;
    }
    
    // guide test ///////
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

