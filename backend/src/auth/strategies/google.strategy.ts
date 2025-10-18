import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientId = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientId || !clientSecret || !callbackURL) {
      throw new InternalServerErrorException('Google OAuth não configurado');
    }

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Chamado pelo Passport após o Google nos redirecionar com sucesso.
   */
  async validate(
    accessToken: string, // Token do Google (não usamos)
    refreshToken: string, // Token do Google (não usamos)
    profile: Profile,
  ): Promise<any> {
    const user = await this.authService.validateGoogleUser(profile);

    return user;
  }
}
