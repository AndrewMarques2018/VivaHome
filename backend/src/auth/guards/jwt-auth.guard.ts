import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Herdamos tudo da estratégia 'jwt' que registramos.
  // O NestJS cuida de rodar o `validate()` da JwtStrategy
  // e retornar 401 Unauthorized se o token for inválido.
}
