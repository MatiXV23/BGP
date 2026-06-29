import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Ciudadano } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class CiudadanosService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ciudadanos`;

  public async getAll(): Promise<Ciudadano[]> {
    return await firstValueFrom(this.httpClient.get<Ciudadano[]>(this.base));
  }

  public async getByCedula(cedula: string): Promise<Ciudadano> {
    return await firstValueFrom(this.httpClient.get<Ciudadano>(`${this.base}/${cedula}`));
  }

  public async create(datos: Ciudadano): Promise<Ciudadano> {
    return await firstValueFrom(this.httpClient.post<Ciudadano>(this.base, datos));
  }

  public async update(cedula: string, datos: Partial<Ciudadano>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${cedula}`, datos));
  }

  public async delete(cedula: string): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${cedula}`));
  }
}
