import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail não pode ser vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha não pode ser vazia.' })
  password: string;
}
