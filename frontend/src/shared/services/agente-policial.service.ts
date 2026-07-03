import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { AgentePolicial } from '../types/electoral';

@Injectable({
  providedIn: 'root',
})
export class AgentePolicialService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/agente_policial`;

  public async getAll(): Promise<AgentePolicial[]> {
    return await firstValueFrom(this.httpClient.get<AgentePolicial[]>(this.base));
  }

  public async getById(cedula_identidad: number): Promise<AgentePolicial> {
    return await firstValueFrom(
      this.httpClient.get<AgentePolicial>(`${this.base}/${cedula_identidad}`),
    );
  }

  public async create(data: AgentePolicial): Promise<AgentePolicial> {
    return await firstValueFrom(this.httpClient.post<AgentePolicial>(this.base, data));
  }

  public async update(cedula_identidad: number, data: AgentePolicial): Promise<void> {
    await firstValueFrom(this.httpClient.put<void>(`${this.base}/${cedula_identidad}`, data));
  }

  public async patch(cedula_identidad: number, data: Partial<AgentePolicial>): Promise<void> {
    await firstValueFrom(this.httpClient.patch<void>(`${this.base}/${cedula_identidad}`, data));
  }

  public async delete(cedula_identidad: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${this.base}/${cedula_identidad}`));
  }
}
