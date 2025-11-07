import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CryptoService } from 'src/common/crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = dto.password
      ? await this.cryptoService.hash(dto.password)
      : null;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        googleId: dto.googleId,
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
      dto.password = await this.cryptoService.hash(dto.password);
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
