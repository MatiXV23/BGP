import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { TipoEleccion, TipoEleccionPost } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class TiposEleccionService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tipos-eleccion`;

  public async getAll(): Promise<TipoEleccion[]> {
    return await firstValueFrom(this.httpClient.get<TipoEleccion[]>(this.base));
  }

  public async getById(id: number): Promise<TipoEleccion> {
    return await firstValueFrom(this.httpClient.get<TipoEleccion>(`${this.base}/${id}`));
  }

  public async create(datos: TipoEleccionPost): Promise<TipoEleccion> {
    return await firstValueFrom(this.httpClient.post<TipoEleccion>(this.base, datos));
  }

  public async update(id: number, datos: Partial<TipoEleccion>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${id}`, datos));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${id}`));
  }
}
