/* eslint-disable max-classes-per-file */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './infrastructure/interceptors/exception.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen(3000);
}
bootstrap();
