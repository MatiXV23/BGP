import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ParticipacionVotante, ParticipacionVotantePost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class ParticipacionVotanteService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/participacion_votante`;

  public async getAll(): Promise<ParticipacionVotante[]> {
    return await firstValueFrom(
      this.httpClient.get<ParticipacionVotante[]>(this.base)
    );
  }

  public async getById(id: number): Promise<ParticipacionVotante> {
    return await firstValueFrom(
      this.httpClient.get<ParticipacionVotante>(`${this.base}/${id}`)
    );
  }

  public async create(data: ParticipacionVotantePost): Promise<ParticipacionVotante> {
    return await firstValueFrom(
      this.httpClient.post<ParticipacionVotante>(this.base, data)
    );
  }

  public async update(id: number, data: ParticipacionVotante): Promise<void> {
    await firstValueFrom(
      this.httpClient.put<void>(`${this.base}/${id}`, data)
    );
  }

  public async patch(id: number, data: Partial<ParticipacionVotante>): Promise<void> {
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