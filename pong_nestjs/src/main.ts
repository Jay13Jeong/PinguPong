import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //모든 api문자열앞에 api/를 붙임.
  await app.listen(3000);
}
bootstrap();
