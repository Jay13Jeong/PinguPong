import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { AppModule } from 'src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';

@Module({
  imports: [
		TypeOrmModule.forFeature([User]),
  ], 
	controllers: [
		UsersController,
	],
  providers: [
    UsersService,
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
