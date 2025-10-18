// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 1. Tornar este módulo "Global"
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 2. Exportar o serviço
})
export class PrismaModule {}
