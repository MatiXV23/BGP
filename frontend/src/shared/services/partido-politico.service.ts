import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PartidoPolitico, PartidoPoliticoPost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class PartidoPoliticoService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/partido_politico`;

  public async getAll(): Promise<PartidoPolitico[]> {
    return await firstValueFrom(
      this.httpClient.get<PartidoPolitico[]>(this.base)
    );
  }

  public async getById(id: number): Promise<PartidoPolitico> {
    return await firstValueFrom(
      this.httpClient.get<PartidoPolitico>(`${this.base}/${id}`)
    );
  }

  public async create(data: PartidoPoliticoPost): Promise<PartidoPolitico> {
    return await firstValueFrom(
      this.httpClient.post<PartidoPolitico>(this.base, data)
    );
  }

  public async update(id: number, data: PartidoPolitico): Promise<void> {
    await firstValueFrom(
      this.httpClient.put<void>(`${this.base}/${id}`, data)
    );
  }

  public async patch(id: number, data: Partial<PartidoPolitico>): Promise<void> {
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