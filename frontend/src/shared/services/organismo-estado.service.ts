import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { OrganismoEstado, OrganismoEstadoPost } from '../types/electoral';
@Injectable({
  providedIn: 'root',
})
export class OrganismoEstadoService {
  private httpClient = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/organismo_estado`;

  public async getAll(): Promise<OrganismoEstado[]> {
    return await firstValueFrom(this.httpClient.get<OrganismoEstado[]>(this.base));
  }

  public async getById(id: number): Promise<OrganismoEstado> {
    return await firstValueFrom(this.httpClient.get<OrganismoEstado>(`${this.base}/${id}`));
  }

  public async create(data: OrganismoEstadoPost): Promise<OrganismoEstado> {
    return await firstValueFrom(this.httpClient.post<OrganismoEstado>(this.base, data));
  }

  public async update(id: number, data: OrganismoEstado): Promise<void> {
    await firstValueFrom(this.httpClient.put<void>(`${this.base}/${id}`, data));
  }

  public async patch(id: number, data: Partial<OrganismoEstado>): Promise<void> {
    await firstValueFrom(this.httpClient.patch<void>(`${this.base}/${id}`, data));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${this.base}/${id}`));
  }
}
