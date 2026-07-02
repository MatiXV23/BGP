import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Departamento, DepartamentoPost } from '../types/electoral';

@Injectable({ providedIn: 'root' })
export class DepartamentosService {
  private httpClient = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/departamento`;

  public async getAll(): Promise<Departamento[]> {
    return await firstValueFrom(this.httpClient.get<Departamento[]>(this.base));
  }

  public async getById(id: number): Promise<Departamento> {
    return await firstValueFrom(this.httpClient.get<Departamento>(`${this.base}/${id}`));
  }

  public async create(datos: DepartamentoPost): Promise<Departamento> {
    return await firstValueFrom(this.httpClient.post<Departamento>(this.base, datos));
  }

  public async update(id: number, datos: Partial<Departamento>): Promise<void> {
    await firstValueFrom(this.httpClient.patch(`${this.base}/${id}`, datos));
  }

  public async delete(id: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete(`${this.base}/${id}`));
  }
}
