import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { HttpModule } from '@nestjs/axios'; // 1. Importar

@Module({
  imports: [HttpModule], // 2. Adicionar o HttpModule
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
