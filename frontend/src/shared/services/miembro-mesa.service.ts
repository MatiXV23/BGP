import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

import type { MiembroMesa } from '../types/electoral';

@Injectable({
  providedIn: 'root',
})
export class MiembrosMesaService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/miembro_mesa`;

  public async getAll(): Promise<MiembroMesa[]> {
    return await firstValueFrom(this.httpClient.get<MiembroMesa[]>(this.base));
  }

  public async getById(id: number): Promise<MiembroMesa> {
    return await firstValueFrom(this.httpClient.get<MiembroMesa>(`${this.base}/${id}`));
  }

  public async create(data: MiembroMesa): Promise<MiembroMesa> {
    return await firstValueFrom(this.httpClient.post<MiembroMesa>(this.base, data));
  }

  public async update(id: number, data: MiembroMesa): Promise<void> {
    await firstValueFrom(this.httpClient.put<void>(`${this.base}/${id}`, data));
  }

  public async patch(id: number, data: Partial<MiembroMesa>): Promise<void> {
    await firstValueFrom(this.httpClient.patch<void>(`${this.base}/${id}`, data));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${this.base}/${id}`));
  }
}
