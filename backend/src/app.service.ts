/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailService) {}

  getPing(): string {
    return 'pong';
  }

  async testSendEmail() {
    // --- IMPORTANTE ---
    // Se você estiver usando o 'onboarding@resend.dev',
    // o 'to' DEVE ser o e-mail que você usou para se cadastrar no Resend.
    const seuEmailDeCadastro = 'andrewmarques2018@gmail.com';

    try {
      await this.mailService.sendEmail({
        to: seuEmailDeCadastro,
        subject: 'Teste de E-mail Viva Home - Resend',
        template: 'password-reset', // Usar o template que criamos
        context: {
          name: 'Usuário de Teste',
          link: 'http://localhost:3001/reset-password/fake-token',
        },
      });

      return {
        status: 'ok',
        message: `E-mail de teste enviado para ${seuEmailDeCadastro}`,
      };
    } catch (error) {
      // Retornar o erro de forma amigável
      return {
        status: 'error',
        message: 'Falha ao enviar e-mail de teste.',
        error: error.message,
      };
    }
  }
}
