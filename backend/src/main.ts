import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades "extras" forem enviadas
      transform: true, // Transforma o payload para o tipo do DTO (ex: string para number)
    }),
  );

  await app.listen(3000);
}
void bootstrap();
