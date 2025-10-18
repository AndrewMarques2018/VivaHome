import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from 'src/user/entities/user.entity';

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
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
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

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this._generateTokens(user.id, user.email);

    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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
}
