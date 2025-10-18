/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
