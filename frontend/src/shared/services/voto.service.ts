import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Voto, VotoPost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class VotoService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/voto`;

  public async getAll(): Promise<Voto[]> {
    return await firstValueFrom(
      this.httpClient.get<Voto[]>(this.base)
    );
  }

  public async getById(id: number): Promise<Voto> {
    return await firstValueFrom(
      this.httpClient.get<Voto>(`${this.base}/${id}`)
    );
  }

  public async create(data: VotoPost): Promise<Voto> {
    return await firstValueFrom(
      this.httpClient.post<Voto>(this.base, data)
    );
  }

  public async update(id: number, data: Voto): Promise<void> {
    await firstValueFrom(
      this.httpClient.put<void>(`${this.base}/${id}`, data)
    );
  }

  public async patch(id: number, data: Partial<Voto>): Promise<void> {
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