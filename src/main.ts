import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserExceptionsFilter } from './user/filters/user-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new UserExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
