/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendEmailOptions } from './mail.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    // Pegar a API Key e o E-mail "De" do .env
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const defaultFrom = this.configService.get<string>('EMAIL_FROM');

    if (!apiKey || !defaultFrom) {
      throw new InternalServerErrorException(
        'Configuração de e-mail (RESEND_API_KEY ou EMAIL_FROM) incompleta.',
      );
    }

    this.resend = new Resend(apiKey);
    this.defaultFrom = defaultFrom;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, template, context } = options;

    try {
      const html = this._renderTemplate(template, context);

      const payload = {
        from: this.defaultFrom,
        to: to,
        subject: subject,
        html: html,
      };

      await this.resend.emails.send(payload);

      this.logger.log(`E-mail enviado com sucesso para '${to}'.`);
    } catch (error) {
      this.logger.error(`Falha ao enviar e-mail para '${to}'`, error.stack);
      throw error;
    }
  }

  private _renderTemplate(
    template: string,
    context: Record<string, any>,
  ): string {
    const templatePath = path.join(
      process.cwd(),
      'src/mail/templates',
      `${template}.html`,
    );

    if (!fs.existsSync(templatePath)) {
      this.logger.error(`Template de e-mail não encontrado: ${templatePath}`);
      throw new InternalServerErrorException(
        'Template de e-mail não encontrado.',
      );
    }

    let html = fs.readFileSync(templatePath, 'utf-8');

    // Substituir os placeholders (ex: {{name}}) pelos valores do contexto
    Object.keys(context).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, context[key]);
    });

    return html;
  }
}
