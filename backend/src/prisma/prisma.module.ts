import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 1. Tornar este módulo "Global"
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
