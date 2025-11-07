import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token não pode ser vazio.' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha não pode ser vazia.' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
