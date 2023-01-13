import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //모든 api문자열앞에 api/를 붙임.
  app.useGlobalPipes(new ValidateInputPipe()); //파라메터 유효성 검사 미들웨어. 
  await app.listen(3000);
}
bootstrap();
