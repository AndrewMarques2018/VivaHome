import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

export const HASH_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, HASH_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    return new UserEntity(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

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
