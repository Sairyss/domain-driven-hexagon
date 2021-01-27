/* eslint-disable max-classes-per-file */
import { initDomainEventHandlers } from '@modules/domain-event-handlers';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './infrastructure/interceptors/exception.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ExceptionInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  initDomainEventHandlers();

  await app.listen(3000);
}
bootstrap();
