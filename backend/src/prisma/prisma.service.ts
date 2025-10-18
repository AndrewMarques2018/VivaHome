/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown {

  async onModuleInit() {
    // É uma boa prática conectar explicitamente ao DB na inicialização
    await this.$connect();
  }

  async onApplicationShutdown(signal?: string) {
    // Garante que o Prisma feche a conexão de forma graciosa
    await this.$disconnect();
  }
}
