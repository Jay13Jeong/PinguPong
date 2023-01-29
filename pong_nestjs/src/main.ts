import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //모든 api문자열앞에 api/를 붙임.
  app.useGlobalPipes(new ValidateInputPipe()); //파라메터 유효성 검사 미들웨어.
  app.use(cookieParser()); //리퀘스트에서 jwt토큰 추출용 파서.
  await app.listen(3000);
}
bootstrap();
