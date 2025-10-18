/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly sessionService: SessionService) {}

  /**
   * Job (Cron) para limpar sessões expiradas.
   * Roda todos os dias às 3:00 da manhã.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanExpiredSessions() {
    this.logger.log(
      '[Job: handleCleanExpiredSessions] Iniciando limpeza de sessões expiradas...',
    );

    try {
      const { count } = await this.sessionService.deleteExpiredSessions();
      this.logger.log(
        `[Job: handleCleanExpiredSessions] Limpeza concluída. ${count} sessões expiradas foram removidas.`,
      );
    } catch (error) {
      this.logger.error(
        '[Job: handleCleanExpiredSessions] Falha ao executar o job de limpeza.',
        error.stack,
      );
    }
  }

  // Você pode adicionar outros @Cron() aqui para outros jobs
  // Ex: @Cron(CronExpression.EVERY_HOUR)
  // handleSomethingElse() { ... }
}
