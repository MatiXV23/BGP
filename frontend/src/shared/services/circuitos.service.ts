import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Circuito, CircuitoPost } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class CircuitosService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/circuito`;

  public async getAll(): Promise<Circuito[]> {
    return await firstValueFrom(this.httpClient.get<Circuito[]>(this.base));
  }

  public async getById(id: number): Promise<Circuito> {
    return await firstValueFrom(this.httpClient.get<Circuito>(`${this.base}/${id}`));
  }

  public async create(datos: CircuitoPost): Promise<Circuito> {
    return await firstValueFrom(this.httpClient.post<Circuito>(this.base, datos));
  }

  public async update(id: number, datos: Partial<Circuito>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${id}`, datos));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${id}`));
  }
}
