export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string; // Nome do arquivo (ex: 'password-reset')
  context: Record<string, any>; // Variáveis para o template (ex: { name: 'Andrew' })
}
