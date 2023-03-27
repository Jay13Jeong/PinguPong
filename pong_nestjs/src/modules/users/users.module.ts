import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';

@Module({
  imports: [
		TypeOrmModule.forFeature([Users]),
    MulterModule.registerAsync({ useFactory: () => ({
      dest: './avatars', //업로드위치
    }) }),
  ], 
	controllers: [
		UsersController,
	],
  providers: [
    UsersService,
    JwtService,
    {
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
