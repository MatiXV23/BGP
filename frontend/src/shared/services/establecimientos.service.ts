import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Establecimiento, EstablecimientoPost } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class EstablecimientosService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/establecimientos`;

  public async getAll(): Promise<Establecimiento[]> {
    return await firstValueFrom(this.httpClient.get<Establecimiento[]>(this.base));
  }

  public async getById(id: number): Promise<Establecimiento> {
    return await firstValueFrom(this.httpClient.get<Establecimiento>(`${this.base}/${id}`));
  }

  public async create(datos: EstablecimientoPost): Promise<Establecimiento> {
    return await firstValueFrom(this.httpClient.post<Establecimiento>(this.base, datos));
  }

  public async update(id: number, datos: Partial<Establecimiento>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${id}`, datos));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${id}`));
  }
}
