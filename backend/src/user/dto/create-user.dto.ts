import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail não pode ser vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome não pode ser vazio.' })
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Senha não pode ser vazia.' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres.' })
  password?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}
