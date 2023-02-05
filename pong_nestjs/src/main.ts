import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //모든 api문자열앞에 api/를 붙임.
  app.useGlobalPipes(new ValidateInputPipe()); //파라메터 유효성 검사 미들웨어.
  app.use(cookieParser()); //리퀘스트에서 jwt토큰 추출용 파서.
  app.enableCors({
		origin: [
			"http://" + process.env.SERVER_HOST,
			"http://" + process.env.SERVER_HOST + ":3000",
		],
		credentials: true,
		exposedHeaders: ['randomStringLol', 'X-XSRF-TOKEN', "Authorization"], //csrf token, cors설정.
	});
  await app.listen(3000);
}
bootstrap();
