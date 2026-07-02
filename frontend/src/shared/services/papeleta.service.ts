import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Papeleta, PapeletaPost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class PapeletaService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/papeleta`;

  public async getAll(): Promise<Papeleta[]> {
    return await firstValueFrom(
      this.httpClient.get<Papeleta[]>(this.base)
    );
  }

  public async getById(id: number): Promise<Papeleta> {
    return await firstValueFrom(
      this.httpClient.get<Papeleta>(`${this.base}/${id}`)
    );
  }

  public async create(data: PapeletaPost): Promise<Papeleta> {
    return await firstValueFrom(
      this.httpClient.post<Papeleta>(this.base, data)
    );
  }

  public async update(id: number, data: Papeleta): Promise<void> {
    await firstValueFrom(
      this.httpClient.put<void>(`${this.base}/${id}`, data)
    );
  }

  public async patch(id: number, data: Partial<Papeleta>): Promise<void> {
    await firstValueFrom(
      this.httpClient.patch<void>(`${this.base}/${id}`, data)
    );
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(
      this.httpClient.delete<void>(`${this.base}/${id}`)
    );
  }
}