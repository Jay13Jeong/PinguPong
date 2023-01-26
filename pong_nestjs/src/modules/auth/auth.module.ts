import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//passport 유저인증 라이브러리.
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
//jwt토큰.
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './guard/ft.strategy';
import { SecondAuthController } from './second-auth/second-auth.controller';
import { SecondAuthService } from './second-auth/second-auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: "2h" }, //토큰 만료시간 2시간으로 설정.
    }),
    MailerModule.forRootAsync({
        useFactory: () => ({
              transport: {
                  host: process.env.HOST_2FA, //'smtp.gmail.com',
                  port: 465,
                  ignoreTLS: true,
                  secure: true,
                  auth: {
                      user: process.env.USER_2FA, //'42.4.jjeong@gmail.com',
                      pass: process.env.PASS_2FA, //앱 비번 16자리.
                  },
              },
              defaults: { from: '"no-reply" <modules@nestjs.com>', },
              preview: true,
              template: {
                dir: __dirname + '/templates',
                adapter: new PugAdapter(),
                options: {
                  strict: true,
                },
              },
        })
    }),
  ],
  providers: [
    {
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
    AuthService,
    // JwtStrategy,
    FtStrategy,
    SecondAuthService,
    UsersService,
  ],
  controllers: [AuthController, SecondAuthController]
})
export class AuthModule {}
