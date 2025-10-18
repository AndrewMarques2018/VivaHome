import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { SessionService } from 'src/session/session.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Profile } from 'passport-google-oauth20';
import * as crypto from 'crypto';

export interface AuthPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.password) {
      // Se 'user' não existe OU 'user.password' é 'null', o login falha.
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return new UserEntity(user);
  }

  async register(dto: RegisterDto): Promise<UserEntity> {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    return this.userService.create(dto);
  }

  async login(loginDto: LoginDto, deviceAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const { accessToken, refreshToken } = await this._generateTokens(
      user.id,
      user.email,
    );

    const hashedToken = this._hashToken(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.sessionService.create(
      user.id,
      hashedToken,
      expiresAt,
      deviceAgent,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _generateTokens(userId: string, email: string) {
    const payload: AuthPayload = { userId: userId, email: email };

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new InternalServerErrorException(
        'JWT_REFRESH_SECRET não definido no .env',
      );
    }

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto, deviceAgent?: string) {
    const { refreshToken } = refreshTokenDto;

    const hashedToken = this._hashToken(refreshToken);

    // Encontrar a sessão no banco
    const session =
      await this.sessionService.findValidByHashedToken(hashedToken);

    if (!session) {
      // Se a sessão não existe ou já expirou, forçamos o logout.
      throw new ForbiddenException(
        'Sessão inválida ou expirada. Faça login novamente.',
      );
    }

    // Deletar a sessão antiga (Rotação de Token)
    await this.sessionService.deleteByHashedToken(session.hashedToken);

    const user = await this.userService.findById(session.userId);
    if (!user) {
      throw new ForbiddenException('Usuário não encontrado.');
    }

    // Gerar um NOVO par de tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this._generateTokens(user.id, user.email);

    const newHashedToken = this._hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    await this.sessionService.create(
      user.id,
      newHashedToken,
      expiresAt,
      deviceAgent,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const hashedToken = this._hashToken(refreshToken);

    const { count } =
      await this.sessionService.deleteByHashedToken(hashedToken);

    if (count === 0) {
      // O token não existia ou já foi invalidado.
      // Retornar sucesso de qualquer forma para não vazar informação.
    }

    return { message: 'Logout realizado com sucesso.' };
  }

  /**
   * Validação do Usuário Google (Find-or-Create)
   * Chamado pela GoogleStrategy.
   */
  async validateGoogleUser(profile: Profile): Promise<UserEntity> {
    const { id: googleId, displayName: name, emails } = profile;
    if (!emails || emails.length === 0) {
      throw new InternalServerErrorException(
        'Google profile não retornou e-mail',
      );
    }
    const email = emails[0].value;

    const user = await this.userService.findByEmail(email);

    if (user) {
      // Se ele não tem googleId, linka a conta
      if (!user.googleId) {
        const updatedUser = await this.userService.update(user.id, {
          googleId,
        });
        return updatedUser;
      }

      return new UserEntity(user);
    }

    // Se o usuário NÃO existe, cria um novo
    return this.userService.create({
      email,
      name,
      googleId,
      password: undefined, // Senha é opcional
    });
  }

  /**
   * Lógica de Login Pós-Google
   * Chamado pelo AuthController após o 'validate' da estratégia.
   */
  async loginFromGoogle(user: UserEntity, deviceAgent: string) {
    // O usuário já foi validado/criado.
    // Agora, apenas geramos NOSSOS tokens e criamos a SESSÃO.

    const { accessToken, refreshToken } = await this._generateTokens(
      user.id,
      user.email,
    );

    const hashedToken = this._hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    await this.sessionService.create(
      user.id,
      hashedToken,
      expiresAt,
      deviceAgent,
    );

    return { accessToken, refreshToken };
  }

  /**
   * Helper privado para hashear tokens de forma determinística (SHA256)
   */
  private _hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
