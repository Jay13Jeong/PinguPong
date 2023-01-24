import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//passport 유저인증 라이브러리.
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
//jwt토큰.
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './guard/ft.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: "2h" }, //토큰 만료시간 2시간으로 설정.
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
  ],
  controllers: [AuthController]
})
export class AuthModule {}
