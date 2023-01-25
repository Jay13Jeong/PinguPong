import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
// import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Since we are using PostgreSQL.
      host: process.env.DB_HOST, // We are devoloping locally.
      port: +process.env.DB_PORT, // What we set in our docker-compose file.
      username: process.env.DB_USER, // ""
      password: process.env.DB_PASS, // "pretty straightforward haha"
      database: process.env.DB_NAME_DEVELOPMENT, // db name.
      autoLoadEntities: true, // 엔티티를 자동으로 로드.
      synchronize: true, // 앱을 실행할 때마다 운영 주체가 데이터베이스와 동기화. 개발모드에서만 써야함.
      entities: [User] //디비가 다룰 엔티티목록.
    }),
    // DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
