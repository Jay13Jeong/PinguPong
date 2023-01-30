import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { FriendController } from './friend.controller';
import { Friend } from './friend.entity';
import { FriendService } from './friend.service';

@Module({
  imports: [
		TypeOrmModule.forFeature([Friend, User]),
  ],
  controllers: [FriendController],
  providers: [
    FriendService,
    JwtService,
    UsersService,
    {
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
  ],
  exports: [TypeOrmModule],
})
export class FriendModule {}
