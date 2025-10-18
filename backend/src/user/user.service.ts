// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

// Quantidade de "salt rounds" para o bcrypt. Padrão é 10.
export const HASH_ROUNDS = 10;

@Injectable()
export class UserService {
  // 1. Injetamos o PrismaService
  constructor(private readonly prisma: PrismaService) {}

  // --- MÉTODOS PARA O AUTHMODULE ---

  async create(dto: CreateUserDto): Promise<UserEntity> {
    // 2. Hashear a senha
    const hashedPassword = await bcrypt.hash(dto.password, HASH_ROUNDS);

    // 3. Salvar no banco
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // 4. Retornar a entidade segura (sem a senha)
    return new UserEntity(user);
  }

  async findByEmail(email: string) {
    // Este método retorna o usuário COMPLETO (com senha)
    // pois será usado pelo AuthService para validar o login.
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // --- MÉTODOS PARA O USERCONTROLLER ---

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return new UserEntity(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    // Se a senha foi enviada no DTO, precisamos hasheá-la
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, HASH_ROUNDS);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return new UserEntity(user);
  }

  async delete(id: string): Promise<UserEntity> {
    // Verifica se o usuário existe antes de deletar
    await this.findById(id);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return new UserEntity(deletedUser);
  }
}