// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// NOTA: Estas rotas são públicas.
// Vamos criar um Decorator @Public() se decidirmos
// tornar o JwtAuthGuard global. Por enquanto, está OK.

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    // O AuthService já trata o erro de e-mail duplicado
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK) // Define o status 200 OK para o login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // O AuthService já trata o erro de e-mail/senha inválidos
    return this.authService.login(loginDto);
  }
}
