import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IbgeCity, IbgeState } from './types/location.types';

@Injectable()
export class LocationService {
  constructor(private readonly httpService: HttpService) {}

  async getStates(): Promise<IbgeState[]> {
    const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

    const { data } = await firstValueFrom(
      this.httpService.get<IbgeState[]>(url),
    );

    return data.map(state => ({
      id: state.id,
      nome: state.nome,
      sigla: state.sigla,
    }));
  }

  async getCities(uf: string): Promise<IbgeCity[]> {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

    const { data } = await firstValueFrom(
      this.httpService.get<IbgeCity[]>(url),
    );

    return data.map(city => ({
      id: city.id,
      nome: city.nome,
    }));
  }
}
