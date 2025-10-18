import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from './decorators/user.decorator';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK) // Define o status 200 OK para o login
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    // O AuthService já trata o erro de e-mail/senha inválidos
    const deviceAgent = req.headers['user-agent'] || 'Dispositivo desconhecido';
    return this.authService.login(loginDto, deviceAgent);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const deviceAgent = req.headers['user-agent'] || 'Dispositivo desconhecido';
    return this.authService.refreshTokens(refreshTokenDto, deviceAgent);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Este método não é executado.
    // O @UseGuards(AuthGuard('google')) intercepta a requisição
    // e redireciona para a página de login do Google.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @User() user: UserEntity,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceAgent = req.headers['user-agent'] || 'Dispositivo desconhecido';

    const { accessToken, refreshToken } =
      await this.authService.loginFromGoogle(user, deviceAgent);

    // 4. Validar a URL do frontend
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      throw new InternalServerErrorException(
        'FRONTEND_URL não configurado no .env',
      );
    }

    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}
