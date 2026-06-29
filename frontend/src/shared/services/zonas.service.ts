import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Zona, ZonaPost } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class ZonasService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/zonas`;

  public async getAll(): Promise<Zona[]> {
    return await firstValueFrom(this.httpClient.get<Zona[]>(this.base));
  }

  public async getById(id: number): Promise<Zona> {
    return await firstValueFrom(this.httpClient.get<Zona>(`${this.base}/${id}`));
  }

  public async create(datos: ZonaPost): Promise<Zona> {
    return await firstValueFrom(this.httpClient.post<Zona>(this.base, datos));
  }

  public async update(id: number, datos: Partial<Zona>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${id}`, datos));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${id}`));
  }
}
