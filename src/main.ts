import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response,NextFunction} from 'express'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (request: Request, response: Response, next: NextFunction) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
  await app.listen(3001);
}
bootstrap();
