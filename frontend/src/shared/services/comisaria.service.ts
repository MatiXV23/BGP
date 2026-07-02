import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

import type { Comisaria, ComisariaPost } from '../types/electoral';


@Injectable({
  providedIn: 'root',
})
export class ComisariasService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/comisaria`;

  public async getAll(): Promise<Comisaria[]> {
    return await firstValueFrom(this.httpClient.get<Comisaria[]>(this.base));
  }

  public async getById(id: number): Promise<Comisaria> {
    return await firstValueFrom(this.httpClient.get<Comisaria>(`${this.base}/${id}`));
  }

  public async create(data: ComisariaPost): Promise<Comisaria> {
    return await firstValueFrom(this.httpClient.post<Comisaria>(this.base, data));
  }

  public async update(id: number, data: Comisaria): Promise<void> {
    await firstValueFrom(this.httpClient.put<void>(`${this.base}/${id}`, data));
  }

  public async patch(id: number, data: Partial<Comisaria>): Promise<void> {
    await firstValueFrom(this.httpClient.patch<void>(`${this.base}/${id}`, data));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${this.base}/${id}`));
  }
}