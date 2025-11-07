import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config'; // Para injetar o ConfigService

@Module({
  imports: [ConfigModule], // Para o MailService ler o .env
  providers: [MailService],
  exports: [MailService], // Exportar o serviço
})
export class MailModule {}
