import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
    deviceAgent?: string,
  ) {
    return this.prisma.session.create({
      data: {
        userId: userId,
        hashedToken: hashedToken,
        expiresAt: expiresAt,
        deviceAgent: deviceAgent,
      },
    });
  }

  async findValidByHashedToken(hashedToken: string) {
    return this.prisma.session.findFirst({
      where: {
        hashedToken: hashedToken,
        expiresAt: {
          // 'gt' significa "greater than" (maior que)
          gt: new Date(),
        },
      },
      include: {
        user: true, // Já traz o usuário junto (otimização)
      },
    });
  }

  async deleteByHashedToken(hashedToken: string) {
    return this.prisma.session.deleteMany({
      where: {
        hashedToken: hashedToken,
      },
    });
  }

  async deleteAllByUserId(userId: string) {
    return this.prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async deleteExpiredSessions() {
    return this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          // 'lte' significa "less than or equal to" (menor ou igual a)
          lte: new Date(),
        },
      },
    });
  }
}
