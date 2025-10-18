// src/location/location.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('states')
  getStates() {
    return this.locationService.getStates();
  }

  @Get('states/:uf/cities')
  getCities(@Param('uf') uf: string) {
    return this.locationService.getCities(uf);
  }
}
